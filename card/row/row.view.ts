namespace $.$$ {

	/** Баланс карты в одном салоне. */
	export class $bog_sert_card_row extends $.$bog_sert_card_row {

		/** Салон по ссылке. Без `@ $mol_mem` — объект Базы. */
		shop() {
			const uri = this.shop_uri()
			if( !this.$.$giper_baza_link.check( uri ) ) return null
			const shop = this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( uri ), $bog_sert_shop )
			shop.land().sync()
			return shop
		}

		name() {
			return this.shop()?.title() || this.shop_uri()
		}

		balance() {
			return $bog_sert_op.balance(
				this.shop()?.Ops()?.remote_list() ?? [],
				this.pass_uri(),
			)
		}

		balance_text() {
			return `${ this.balance() } баллов`
		}

	}

}
