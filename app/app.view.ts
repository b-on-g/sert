namespace $.$$ {

	/**
	 * Четыре входа в одно приложение.
	 *
	 * `cert=` — карточка сертификата, `bz=` или `bzname=` — витрина салона,
	 * `pass=` — карта гостя, а без аргументов открывается кабинет владельца.
	 * Посторонний всегда приходит по ссылке и кабинета не видит.
	 */
	export class $bog_sert_app extends $.$bog_sert_app {

		static {
			$bog_builderui_router.activate()
		}

		@ $mol_mem
		cert_uri( next?: string ) {
			return this.$.$mol_state_arg.value( 'cert', next ) ?? ''
		}

		@ $mol_mem
		pass_uri( next?: string ) {
			return this.$.$mol_state_arg.value( 'pass', next ) ?? ''
		}

		/** Имя из адреса, приведённое к тому же виду, в каком его занимали. */
		@ $mol_mem
		bzname( next?: string ) {
			const raw = this.$.$mol_state_arg.value( 'bzname', next ) ?? ''
			return raw ? $bog_sert_name.normal( raw ) : ''
		}

		/** Словарь реестра имён. Пусто, если реестр не заведён. */
		names() {
			const land = $bog_sert_name.land
			if( !this.$.$giper_baza_link.check( land ) ) return null
			const dict = this.$.$giper_baza_glob.Land( new this.$.$giper_baza_link( land ) ).Data( $bog_sert_name )
			dict.land().sync()
			return dict
		}

		/** Заявки на имя из адреса, ранняя первой. */
		claims() {
			const dict = this.names()
			const name = this.bzname()
			if( !dict || !name ) return []
			return $bog_sert_name.claims( dict, name )
		}

		/**
		 * Ленд салона. Прямая ссылка сильнее имени: она не перехватывается,
		 * поэтому если в адресе есть и то и другое, побеждает ссылка.
		 */
		@ $mol_mem
		shop_uri() {
			const direct = this.$.$mol_state_arg.value( 'bz' ) ?? ''
			if( direct ) return direct
			return this.claims()[ 0 ]?.shop ?? ''
		}

		rival_uri( index: number ) {
			return this.claims()[ index ]?.shop ?? ''
		}

		rival_title( index: number ) {
			const claim = this.claims()[ index ]
			if( !claim ) return ''
			const moment = new this.$.$mol_time_moment( claim.time * 1000 )
			return `${ claim.shop } — заявка от ${ moment.toString( 'DD.MM.YYYY' ) }`
		}

		@ $mol_mem
		rival_rows() {
			return this.claims().map( ( _, index )=> this.Rival( index ) )
		}

		sheet_title() {
			return this.Sheet_card().shop() || 'Сертификат'
		}

		front_title() {
			return this.Front_body().name()
		}

		override app_body() {

			if( this.cert_uri() ) return [ this.Sheet() ]
			if( this.pass_uri() ) return [ this.Card() ]

			if( this.shop_uri() ) return [ this.Front() ]
			if( this.bzname() ) return [ this.claims().length > 1 ? this.Rivals() : this.Front() ]

			return [ this.Desk() ]
		}

		/** Домашний ленд заводится сам при первом открытии. */
		@ $mol_mem
		auto() {
			this.$.$giper_baza_glob.home()
			return []
		}

	}

}
