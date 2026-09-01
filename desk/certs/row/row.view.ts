namespace $.$$ {

	/** Строка реестра: что за сертификат, кому и в каком он состоянии. */
	export class $bog_sert_desk_certs_row extends $.$bog_sert_desk_certs_row {

		/**
		 * Сертификат этой строки. Без `@ $mol_mem`, потому что это объект Базы.
		 *
		 * `sync()` тут не зовём: ленды своих сертификатов лежат локально,
		 * а чтение полей и так поднимает синхронизацию.
		 */
		cert() {
			const uri = this.cert_uri()
			if( !this.$.$giper_baza_link.check( uri ) ) return null
			return this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( uri ), $bog_sert_cert )
		}

		gift() {
			const cert = this.cert()
			if( !cert ) return this.cert_uri()
			return $bog_sert_cert.gift_text( cert.Cost()?.val() ?? 0, cert.title() ) || 'Без названия'
		}

		whom() {
			return this.cert()?.Whom()?.val() || '—'
		}

		state() {
			const cert = this.cert()
			if( !cert ) return ''
			return $bog_sert_cert.state_text(
				cert.Used()?.val() ?? null,
				cert.Till()?.val() ?? null,
				Date.now(),
			)
		}

		/** Строка всегда ведёт на сертификат: «текущей» ссылкой она не бывает. */
		override current() {
			return false
		}

	}

}
