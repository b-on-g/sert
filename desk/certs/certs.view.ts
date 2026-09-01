namespace $.$$ {

	/** Реестр выпущенных сертификатов, новые сверху. */
	export class $bog_sert_desk_certs extends $.$bog_sert_desk_certs {

		cert_uris(): readonly string[] {
			const items: readonly $giper_baza_link[] = this.shop()?.List()?.items() ?? []
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
			const count = this.cert_uris().length
			return count ? `Выданные — ${ count }` : 'Выданные'
		}

		override certs_body() {
			return this.cert_uris().length ? [ this.List() ] : [ this.Empty() ]
		}

	}

}
