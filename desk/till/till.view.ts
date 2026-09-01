namespace $.$$ {

	/**
	 * Касса. Кассир наводит камеру на карту гостя, вводит сумму чека и начисляет.
	 *
	 * Направление сканирования выбрано так намеренно: пишет всегда салон, поэтому
	 * подделать начисление гостю нечем. Обратный порядок, когда гость сканирует
	 * код на стойке, превратил бы этот код в ферму баллов.
	 */
	export class $bog_sert_desk_till extends $.$bog_sert_desk_till {

		/** Ссылка карты текущего гостя. */
		@ $mol_mem
		pass_uri( next?: string ) {
			return next ?? ''
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

		/** Операции по этой карте, старые первыми. */
		pass_ops(): readonly $bog_sert_op[] {
			const pass = this.pass_uri()
			if( !pass ) return []
			return this.ops().filter( op => op.Pass()?.val() === pass )
		}

		balance() {
			return $bog_sert_op.balance( this.ops(), this.pass_uri() )
		}

		guest_title() {
			const pass = this.pass_uri()
			if( !pass ) return ''
			const card = this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( pass ), $bog_sert_pass )
			card.land().sync()
			return card.title() || `Карта ${ pass }`
		}

		balance_text() {
			const visits = this.pass_ops().length
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
			if( this.pass_ops().length ) return 0
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

			const shop = this.shop()
			if( !shop ) return

			// Подвисающие чтения — до записи.
			const pass = this.pass_uri()
			const gain = this.gain()
			const welcome = this.welcome_sum()
			const cost = Math.max( 0, Math.round( this.cost() ) )
			if( !pass || ( !gain && !welcome ) ) return

			const now = new this.$.$mol_time_moment()
			const list = shop.Ops( 'auto' )!

			if( welcome ) this.op_add( list, 'Приветственный', pass, 0, welcome, now )
			if( gain ) this.op_add( list, 'Покупка', pass, cost, gain, now )

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

			const shop = this.shop()
			if( !shop ) return

			const pass = this.pass_uri()
			const want = Math.max( 0, Math.round( this.writeoff() ) )
			const limit = this.spend_limit()
			if( !pass || !want || want > limit ) return

			this.op_add(
				shop.Ops( 'auto' )!,
				'Списание',
				pass,
				Math.max( 0, Math.round( this.cost() ) ),
				-want,
				new this.$.$mol_time_moment(),
			)

			this.writeoff( 0 )
			this.done( `Списано ${ want } баллов` )
		}

		/**
		 * Операция кладётся прямо в ленд салона: `make( null )` заводит её здесь же,
		 * без отдельного ленда и без доказательства работы, иначе касса ждала бы
		 * секунды на каждом чеке.
		 */
		op_add(
			list: ReturnType< $bog_sert_shop[ 'Ops' ] > & object,
			title: string,
			pass: string,
			cost: number,
			delta: number,
			now: $mol_time_moment,
		) {
			const op = list.make( null )
			op.Title( 'auto' )!.val( title )
			op.Pass( 'auto' )!.val( pass )
			op.Cost( 'auto' )!.val( cost )
			op.Delta( 'auto' )!.val( delta )
			op.Made( 'auto' )!.val( now )
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

			if( !this.pass_ops().length && ( this.shop()?.Bonus()?.val() ?? 0 ) > 0 ) rows.push( this.Welcome() )

			rows.push( this.Accrue() )

			if( this.balance() > 0 ) rows.push( this.Writeoff_field(), this.Spend() )

			rows.push( this.Reset() )

			return rows
		}

		override till_body() {
			if( this.pass_uri() ) return [ this.Guest(), this.Done() ]
			return [ this.Scan(), this.Manual_field(), this.Manual_apply() ]
		}

	}

}
