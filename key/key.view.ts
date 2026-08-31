namespace $.$$ {

	/** Перенос доступа между устройствами: показать свой ключ и принять чужой. */
	export class $bog_sert_key extends $.$bog_sert_key {

		/** Ровно та строка, которую База держит в хранилище браузера. */
		mine() {
			const auth = this.$.$giper_baza_auth.current()
			return auth.toString() + auth.toStringPrivate()
		}

		@ $mol_mem
		other( next?: string ) {
			return next ?? ''
		}

		@ $mol_mem
		result( next?: string ) {
			return next ?? ''
		}

		override enter_allowed() {
			return Boolean( this.other().trim() )
		}

		@ $mol_action
		copy() {
			this.$.$mol_dom_context.navigator.clipboard.writeText( this.mine() )
			this.result( 'Ключ скопирован' )
		}

		@ $mol_action
		enter() {

			const key = this.other().trim()
			if( !key ) return

			const auth = this.auth_of( key )
			if( !auth ) {
				this.result( 'Это не похоже на ключ' )
				return
			}

			this.$.$giper_baza_auth.current( auth )

			// Ленды в памяти привязаны к прежнему ключу, чистить их поштучно
			// дороже и опаснее, чем начать страницу заново.
			this.$.$mol_dom_context.location.reload()
		}

		/** Разбор вставленной строки. Мусор возвращает `null`, а не бросает. */
		auth_of( key: string ) {
			try {
				const auth = this.$.$giper_baza_auth.from( key )
				return auth.byteLength === 128 ? auth : null
			} catch( error ) {
				if( error instanceof Promise ) $mol_fail( error )
				return null
			}
		}

	}

}
