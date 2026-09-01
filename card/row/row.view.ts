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

		/**
		 * Операции этого салона, у которых подпись сходится с его бригадой.
		 *
		 * Дописать в карту может кто угодно, включая её владельца, поэтому
		 * баланс считается не по всему, что тут лежит, а только по записям
		 * тех, кого салон назвал своими.
		 */
		ledger(): readonly $bog_sert_op_read[] {
			return $bog_sert_op.ledger(
				this.ops(),
				$bog_sert_hand.crew( this.shop() ),
				this.shop_uri(),
			)
		}

		balance() {
			return $bog_sert_op.balance( this.ledger() )
		}

		balance_text() {
			return `${ this.balance() } баллов`
		}

	}

}
