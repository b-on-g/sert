namespace $.$$ {

	/** Форма выпуска. Выпущенный сертификат сразу показывается карточкой. */
	export class $bog_sert_desk_issue extends $.$bog_sert_desk_issue {

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

		/** Ссылка последнего выпущенного, чтобы сразу показать карточку. */
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

			const shop = this.shop()
			if( !shop ) return

			// Чтения из Базы могут подвиснуть промисом, и тогда фибра стартует заново.
			// Поэтому сначала всё читаем, и только потом пишем.
			const name = shop.title()
			const note = shop.Note()?.val() ?? ''
			const term = shop.Term()?.val() ?? 6

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

		override issue_body() {
			if( !this.last() ) return [ this.Form() ]
			return [ this.Form(), this.Last_block() ]
		}

	}

}
