namespace $.$$ {

	/**
	 * Карта гостя: свой QR для кассы и баланс по каждому салону.
	 *
	 * Баллы лежат не здесь, а в книгах операций салонов, подписанных их ключами.
	 * Карта только складывает то, что там записано, поэтому подделать баланс,
	 * правя свою же карту, невозможно.
	 */
	export class $bog_sert_card extends $.$bog_sert_card {

		/** Карта по ссылке. Без `@ $mol_mem` — объект Базы. */
		pass() {
			const uri = this.uri()
			if( !this.$.$giper_baza_link.check( uri ) ) return null
			const pass = this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( uri ), $bog_sert_pass )
			pass.land().sync()
			return pass
		}

		/** Салоны, где карту заводили. */
		shop_uris(): readonly string[] {
			return this.pass()?.Shops()?.items() ?? []
		}

		ident() {
			return this.uri()
		}

		/** Абсолютный адрес этой же карты — он же содержимое QR для кассы. */
		page_uri() {
			const uri = this.uri()
			if( !uri ) return ''
			return this.$.$mol_state_arg.link( { page: null, bz: null, bzname: null, pass: uri } )
		}

		row_uri( uri: string ) {
			return uri
		}

		@ $mol_mem
		override shop_rows() {
			return this.shop_uris().map( uri => this.Shop_row( uri ) )
		}

		/** Сумма по всем салонам. */
		override total() {
			// Строка считает баланс сама, но её метод объявлен в `$.$$`, куда
			// сгенерированный из view.tree тип не заглядывает — отсюда каст.
			const sum = this.shop_uris().reduce(
				( acc, uri )=> acc + ( this.Shop_row( uri ) as $.$$.$bog_sert_card_row ).balance(),
				0,
			)
			return `${ sum } баллов`
		}

		override card_rows() {

			if( !this.pass() ) return [ this.Empty() ]

			return [
				this.Head(),
				this.Code(),
				this.Ident(),
				... this.shop_uris().length ? [ this.Shops() ] : [],
				this.Save(),
			]
		}

	}

}
