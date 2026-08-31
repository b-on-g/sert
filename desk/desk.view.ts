namespace $.$$ {

	/**
	 * Кабинет салона: реквизиты, форма выпуска и реестр выпущенного.
	 * Всё лежит в домашнем ленде владельца, наружу уходят только сертификаты.
	 */
	export class $bog_sert_desk extends $.$bog_sert_desk {

		/**
		 * Салон текущего пользователя.
		 *
		 * Без `@ $mol_mem`: метод отдаёт объект Базы, а $mol при сбросе ячейки
		 * дёрнул бы у него `destructor()`.
		 */
		shop() {
			return this.$.$giper_baza_glob.home().land().Data( $bog_sert_shop )
		}

		@ $mol_mem
		shop_name( next?: string ) {
			return this.shop().title( next )
		}

		@ $mol_mem
		shop_note( next?: string ) {
			return this.shop().Note( next )?.val( next ) ?? ''
		}

		@ $mol_mem
		shop_term( next?: number ) {
			const term = next === undefined ? undefined : Math.max( 0, Math.round( next ) )
			return this.shop().Term( term )?.val( term ) ?? 6
		}

		@ $mol_mem
		gift( next?: string ) {
			return next ?? ''
		}

		@ $mol_mem
		cost( next?: number ) {
			return next ?? 0
		}

		@ $mol_mem
		whom( next?: string ) {
			return next ?? ''
		}

		@ $mol_mem
		from( next?: string ) {
			return next ?? ''
		}

		@ $mol_mem
		mail( next?: string ) {
			return next ?? ''
		}

		@ $mol_mem
		wish( next?: string ) {
			return next ?? ''
		}

		/** Ссылка последнего выпущенного сертификата, чтобы сразу показать карточку. */
		@ $mol_mem
		last( next?: string ) {
			return next ?? ''
		}

		/** Пустой сертификат выпускать незачем: нужна либо услуга, либо сумма. */
		override issue_allowed() {
			return Boolean( this.gift().trim() ) || this.cost() > 0
		}

		@ $mol_action
		issue() {

			// Чтения из Базы могут подвиснуть промисом, и тогда фибра стартует заново.
			// Поэтому сначала всё читаем, и только потом пишем.
			const shop = this.shop()
			const name = shop.title()
			const note = shop.Note()?.val() ?? ''
			const term = this.shop_term()

			const gift = this.gift().trim()
			const cost = Math.max( 0, Math.round( this.cost() ) )
			const whom = this.whom().trim()
			const from = this.from().trim()
			const mail = this.mail().trim()
			const wish = this.wish().trim()

			if( !gift && !cost ) return

			const now = new this.$.$mol_time_moment()

			// Сертификат получает свой ленд: ссылка на него и есть предъявитель,
			// поэтому читать его может каждый, кому эту ссылку прислали.
			const cert = shop.List( 'auto' )!.make( [
				[ null, this.$.$giper_baza_rank_read ],
			] )

			cert.Title( 'auto' )!.val( gift )
			cert.Shop( 'auto' )!.val( name )
			cert.Note( 'auto' )!.val( note )
			cert.Cost( 'auto' )!.val( cost )
			cert.Whom( 'auto' )!.val( whom )
			cert.From( 'auto' )!.val( from )
			cert.Mail( 'auto' )!.val( mail )
			cert.Wish( 'auto' )!.val( wish )
			cert.Made( 'auto' )!.val( now )
			if( term > 0 ) cert.Till( 'auto' )!.val( now.shift( { month: term } ) )

			// Номинал и услуга обычно повторяются от подарка к подарку, их оставляем.
			this.whom( '' )
			this.from( '' )
			this.mail( '' )
			this.wish( '' )

			this.last( cert.link().str )
		}

		/** Ссылки выпущенных сертификатов, новые сверху. */
		cert_uris(): readonly string[] {
			const items = this.shop().List()?.items() ?? []
			return items.map( link => link.str ).reverse()
		}

		row_uri( uri: string ) {
			return uri
		}

		@ $mol_mem
		override cert_rows() {
			return this.cert_uris().map( uri => this.Row( uri ) )
		}

		override list_title() {
			return `Выпущенные — ${ this.cert_uris().length }`
		}

		override desk_rows() {

			const rows: readonly $mol_view[] = [
				this.Shop_block(),
				... this.shop_name() ? [ this.Issue_block() ] : [],
				... this.last() ? [ this.Last_block() ] : [],
				... this.cert_uris().length ? [ this.List_block() ] : [],
			]

			return rows
		}

	}

}
