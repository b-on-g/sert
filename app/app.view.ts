namespace $.$$ {

	/**
	 * Два входа в одно приложение: кабинет салона по своему ключу
	 * и карточка сертификата по присланной ссылке.
	 */
	export class $bog_sert_app extends $.$bog_sert_app {

		static {
			$bog_builderui_router.activate()
		}

		@ $mol_mem
		screen( next?: string ) {
			return this.$.$mol_state_arg.value( 'screen', next ) ?? 'desk'
		}

		/** Непустая ссылка означает, что открыт сертификат, а не кабинет. */
		@ $mol_mem
		cert_uri( next?: string ) {
			return this.$.$mol_state_arg.value( 'cert', next ) ?? ''
		}

		override page_body() {
			if( this.cert_uri() ) return [ this.Card() ]
			if( this.screen() === 'key' ) return [ this.Key() ]
			return [ this.Desk() ]
		}

		/**
		 * На карточке сертификата переключателя разделов нет: её открывает
		 * получатель подарка, которому кабинет чужого салона ни к чему.
		 */
		override page_tools() {
			if( this.cert_uri() ) return [ this.Home(), this.Theme_toggle() ]
			return [ this.Nav(), this.Status(), this.Theme_toggle() ]
		}

		override page_title() {
			if( this.cert_uri() ) return this.Card().shop() || 'Сертификат'
			if( this.screen() === 'key' ) return 'Ключ доступа'
			return 'Сертификаты'
		}

		/** Домашний ленд заводится сам при первом открытии. */
		@ $mol_mem
		auto() {
			this.$.$giper_baza_glob.home()
			return []
		}

	}

}
