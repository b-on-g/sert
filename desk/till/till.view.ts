namespace $.$$ {

	/**
	 * Касса. Кассир наводит камеру на карту гостя, вводит сумму чека и начисляет.
	 *
	 * Направление сканирования выбрано намеренно: код на стойке только знакомит,
	 * а баллы пишет касса. Обратный порядок превратил бы код в ферму.
	 *
	 * Запись ложится в ленд карты гостя и подписывается ключом кассира. Право
	 * писать туда есть у всех, поэтому оно ничего не значит: в зачёт идут только
	 * записи из бригады салона.
	 */
	export class $bog_sert_desk_till extends $.$bog_sert_desk_till {

		/** Ссылка карты текущего гостя. */
		@ $mol_mem
		pass_uri( next?: string ) {
			return next ?? ''
		}

		/** Карта гостя. Без `@ $mol_mem` — объект Базы. */
		pass() {
			const uri = this.pass_uri()
			if( !this.$.$giper_baza_link.check( uri ) ) return null
			const pass = this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( uri ), $bog_sert_pass )
			pass.land().sync()
			return pass
		}

		/** Камера гасится, как только карта опознана: незачем сканировать дальше. */
		override scanning() {
			return !this.pass_uri()
		}

		/** Пришло из камеры. Внутри адрес страницы, из него достаём ссылку карты. */
		decoded( next?: string ): null {
			const uri = $bog_sert_pass.uri_of( next ?? '' )
			if( uri ) this.pass_uri( uri )
			return null
		}

		@ $mol_mem
		manual( next?: string ) {
			return next ?? ''
		}

		override manual_allowed() {
			return Boolean( $bog_sert_pass.uri_of( this.manual() ) )
		}

		/**
		 * Набранное применяется по нажатию, а не по ходу набора: восемь символов
		 * это уже допустимая ссылка, и касса прыгала бы на несуществующую карту,
		 * не дождавшись остатка номера.
		 */
		@ $mol_action
		manual_apply() {
			const uri = $bog_sert_pass.uri_of( this.manual() )
			if( uri ) this.pass_uri( uri )
		}

		@ $mol_mem
		cost( next?: number ) {
			return next ?? 0
		}

		@ $mol_mem
		writeoff( next?: number ) {
			return next ?? 0
		}

		@ $mol_mem
		welcome( next?: boolean ) {
			return next ?? true
		}

		@ $mol_mem
		done( next?: string ) {
			return next ?? ''
		}

		/** Проверенные операции этой карты в этом салоне. */
		ledger(): readonly $bog_sert_op_read[] {
			const pass = this.pass()
			if( !pass ) return []
			return $bog_sert_op.ledger(
				pass.Ops()?.remote_list() ?? [],
				this.crew(),
				this.shop_uri(),
			)
		}

		balance() {
			return $bog_sert_op.balance( this.ledger() )
		}

		/**
		 * Только номер. Имя из карты не читаем: вписать его может кто угодно,
		 * и кассир увидел бы подпись постороннего как имя гостя.
		 */
		guest_title() {
			return this.pass_uri() ? `Карта ${ this.pass_uri() }` : ''
		}

		balance_text() {
			const visits = this.ledger().length
			if( !visits ) return 'Первый визит, баланс 0'
			return `Баланс ${ this.balance() } баллов, операций ${ visits }`
		}

		/** Сколько начислим за введённый чек. */
		gain() {
			return $bog_sert_op.accrual(
				Math.max( 0, Math.round( this.cost() ) ),
				this.shop()?.Rate()?.val() ?? 0,
			)
		}

		/** Приветственный даётся один раз и только если по карте ещё ничего не было. */
		welcome_sum() {
			if( this.ledger().length ) return 0
			if( !this.welcome() ) return 0
			return Math.max( 0, Math.round( this.shop()?.Bonus()?.val() ?? 0 ) )
		}

		override welcome_title() {
			const sum = Math.round( this.shop()?.Bonus()?.val() ?? 0 )
			return `Приветственный бонус, ${ sum } баллов`
		}

		accrual_text() {
			const gain = this.gain()
			const welcome = this.welcome_sum()
			if( !gain && !welcome ) return 'Начислять нечего'
			if( !welcome ) return `Начислим ${ gain } баллов`
			return `Начислим ${ gain + welcome } баллов, из них ${ welcome } приветственных`
		}

		override accrue_allowed() {
			return this.gain() > 0 || this.welcome_sum() > 0
		}

		@ $mol_action
		accrue() {

			const pass = this.pass()
			if( !pass ) return

			// Подвисающие чтения — до записи.
			const shop_uri = this.shop_uri()
			const gain = this.gain()
			const welcome = this.welcome_sum()
			const cost = Math.max( 0, Math.round( this.cost() ) )
			const vault = this.vault()
			const known = vault?.Cards()?.items() ?? []
			if( !shop_uri || ( !gain && !welcome ) ) return

			const list = pass.Ops( 'auto' )!

			if( welcome ) this.op_add( list, 'Приветственный', shop_uri, 0, welcome )
			if( gain ) this.op_add( list, 'Покупка', shop_uri, cost, gain )

			// Список гостей лежит в закрытой части: наружу он не видён,
			// а кабинету нужен, чтобы было по чему листать карты.
			if( !known.includes( this.pass_uri() ) ) vault?.Cards( 'auto' )!.add( this.pass_uri() )

			this.cost( 0 )
			this.done( `Начислено ${ gain + welcome } баллов` )
		}

		/** Потолок списания: не больше баланса и не дороже самого чека. */
		spend_limit() {
			return $bog_sert_op.writeoff_limit(
				this.balance(),
				Math.max( 0, Math.round( this.cost() ) ),
				this.shop()?.Price()?.val() ?? 1,
			)
		}

		override spend_allowed() {
			const want = Math.max( 0, Math.round( this.writeoff() ) )
			return want > 0 && want <= this.spend_limit()
		}

		@ $mol_action
		spend() {

			const pass = this.pass()
			if( !pass ) return

			const shop_uri = this.shop_uri()
			const want = Math.max( 0, Math.round( this.writeoff() ) )
			const limit = this.spend_limit()
			if( !shop_uri || !want || want > limit ) return

			this.op_add(
				pass.Ops( 'auto' )!,
				'Списание',
				shop_uri,
				Math.max( 0, Math.round( this.cost() ) ),
				-want,
			)

			this.writeoff( 0 )
			this.done( `Списано ${ want } баллов` )
		}

		/**
		 * Операция кладётся прямо в ленд карты через `make( null )`: отдельный
		 * ленд стоит доказательства работы, и касса ждала бы секунды на чеке.
		 */
		op_add(
			list: ReturnType< $bog_sert_pass[ 'Ops' ] > & object,
			title: string,
			shop: string,
			cost: number,
			delta: number,
		) {
			const op = list.make( null )
			op.Title( 'auto' )!.val( title )
			op.Shop( 'auto' )!.val( shop )
			op.Cost( 'auto' )!.val( cost )
			op.Delta( 'auto' )!.val( delta )
			return op
		}

		@ $mol_action
		reset() {
			this.pass_uri( '' )
			this.manual( '' )
			this.cost( 0 )
			this.writeoff( 0 )
			this.welcome( true )
			this.done( '' )
		}

		override guest_rows() {

			const rows: $mol_view[] = [
				this.Guest_head(),
				this.Balance(),
				this.Cost_field(),
				this.Accrual(),
			]

			if( !this.ledger().length && ( this.shop()?.Bonus()?.val() ?? 0 ) > 0 ) rows.push( this.Welcome() )

			rows.push( this.Accrue() )

			if( this.balance() > 0 ) rows.push( this.Writeoff_field(), this.Spend() )

			rows.push( this.Reset() )

			return rows
		}

		/**
		 * Камеры может не быть, она может быть занята, и в доступе могут отказать.
		 * Показываем это словами: рядом ручной ввод, и касса продолжает работать.
		 * Иначе на месте сканера повисает красная плашка с текстом исключения.
		 */
		camera_ready() {
			try {
				// `stream` объявлен в `$.$$`, куда сгенерированный тип не заглядывает.
				( this.Scan() as $.$$.$bog_call_qr_scan ).stream()
				return true
			} catch( error ) {
				if( error instanceof Promise ) $mol_fail( error )
				return false
			}
		}

		override till_body() {

			if( this.pass_uri() ) return [ this.Guest(), this.Done() ]

			return [
				... this.camera_ready() ? [ this.Scan() ] : [ this.No_camera() ],
				this.Manual_field(),
				this.Manual_apply(),
			]
		}

	}

}
