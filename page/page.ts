namespace $ {

	/**
	 * База для страниц кабинета: у каждой есть салон, к которому она относится.
	 *
	 * Объявлена прямо в `$`, а не в `$.$$`, и без своего `view.tree`. Класс,
	 * порождённый из view.tree, наследуется от `$`-версии базы, поэтому методы,
	 * положенные в `$.$$`, до потомков не доходят — ровно так же устроен сам
	 * `$mol_view`.
	 */
	export class $bog_sert_page extends $mol_page {

		/** Ссылка ленда салона. Проставляется из кабинета. */
		shop_uri() {
			return ''
		}

		/**
		 * Салон по ссылке. Без `@ $mol_mem`: метод отдаёт объект Базы, а $mol
		 * при сбросе ячейки дёрнул бы у него `destructor()`.
		 */
		shop() {
			const uri = this.shop_uri()
			if( !this.$.$giper_baza_link.check( uri ) ) return null
			return this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( uri ), $bog_sert_shop )
		}

		/**
		 * Закрытая часть салона. Без `@ $mol_mem` — объект Базы.
		 *
		 * Ленд зашифрован, поэтому у постороннего он будет пустым, а не
		 * недоступным: прав нет, значит и юниты не расшифруются.
		 */
		vault() {
			const shop = this.shop()
			if( !shop ) return null
			const vault = shop.Vault()?.remote()
			vault?.land().sync()
			return vault ?? null
		}

		/** Бригада салона: кому верим на слово в картах гостей. */
		crew() {
			return $bog_sert_hand.crew( this.shop() )
		}

	}

}
