namespace $.$$ {

	/**
	 * Бригада салона: кто имеет право начислять баллы.
	 *
	 * Добавление делает две вещи сразу. Лорд сотрудника попадает в открытый
	 * список на витрине — по нему любой читатель карты убеждается, что запись
	 * сделал салон. А его ключу выдаются права на закрытую часть салона, чтобы
	 * касса видела список гостей.
	 */
	export class $bog_sert_desk_crew extends $.$bog_sert_desk_crew {

		@ $mol_mem
		name( next?: string ) {
			return next ?? ''
		}

		@ $mol_mem
		key( next?: string ) {
			return next ?? ''
		}

		@ $mol_mem
		result( next?: string ) {
			return next ?? ''
		}

		/** Разбор присланного ключа. Мусор возвращает `null`, а не бросает. */
		pass_of( raw: string ) {
			const key = raw.trim()
			if( !key ) return null
			try {
				const pass = this.$.$giper_baza_auth_pass.from( key )
				return pass.byteLength === 64 && pass.uint8( 0 ) === 0xFF ? pass : null
			} catch( error ) {
				if( error instanceof Promise ) $mol_fail( error )
				return null
			}
		}

		override add_allowed() {
			return Boolean( this.name().trim() ) && Boolean( this.pass_of( this.key() ) )
		}

		hands(): readonly $bog_sert_hand[] {
			return this.shop()?.Crew()?.remote_list() ?? []
		}

		@ $mol_action
		add() {

			const shop = this.shop()
			const vault = this.vault()
			if( !shop ) return

			// Подвисающие чтения — до записи.
			const name = this.name().trim()
			const pass = this.pass_of( this.key() )
			const known = this.hands().map( hand => hand.Lord()?.val() ?? '' )
			if( !name || !pass ) return

			const lord = pass.lord().str

			if( known.includes( lord ) ) {
				this.result( 'Этот сотрудник уже в списке' )
				return
			}

			// Право писать в закрытую часть. На карты гостей права не нужны:
			// туда пишут все, а верят подписи из списка ниже.
			vault?.land().give( pass, this.$.$giper_baza_rank_post( 'just' ) )

			const hand = shop.Crew( 'auto' )!.make( null )
			hand.Title( 'auto' )!.val( name )
			hand.Lord( 'auto' )!.val( lord )

			this.name( '' )
			this.key( '' )
			this.result( `${ name } добавлен` )
		}

		@ $mol_action
		row_fire( lord: string ) {

			const vault = this.vault()
			const hand = this.hands().find( one => one.Lord()?.val() === lord )
			if( !hand ) return

			// Дата увольнения важнее отзыва прав: по ней читатель отсекает
			// то, что уволенный мог бы записать задним числом.
			hand.Fired( 'auto' )!.val( new this.$.$mol_time_moment() )

			const pass = this.pass_of( this.key() )
			if( pass && pass.lord().str === lord ) vault?.land().give( pass, this.$.$giper_baza_rank_deny )

			this.result( 'Уволен. Записанное им до этого дня осталось в силе.' )
			return null
		}

		row_lord( lord: string ) {
			return lord
		}

		row_title( lord: string ) {
			return this.hands().find( one => one.Lord()?.val() === lord )?.title() || 'Без имени'
		}

		row_fired( lord: string ) {
			const fired = this.hands().find( one => one.Lord()?.val() === lord )?.Fired()?.val()
			return fired ? `Уволен ${ fired.toString( 'DD.MM.YYYY' ) }` : ''
		}

		@ $mol_mem
		override crew_rows() {
			return this.hands()
				.map( hand => hand.Lord()?.val() ?? '' )
				.filter( Boolean )
				.map( lord => this.Row( lord ) )
		}

	}

}
