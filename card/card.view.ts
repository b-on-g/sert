namespace $.$$ {

	/**
	 * Карточка сертификата — то, что видит получатель, открыв присланную ссылку.
	 * Всё рисуется из самого сертификата: к ленду салона тут доступа нет и не должно быть.
	 */
	export class $bog_sert_card extends $.$bog_sert_card {

		/**
		 * Сертификат по ссылке из адресной строки.
		 *
		 * Без `@ $mol_mem`: метод отдаёт объект Базы, а $mol при сбросе ячейки
		 * дёрнул бы у него `destructor()` и уронил бы весь ленд.
		 */
		cert() {

			const uri = this.uri()
			if( !this.$.$giper_baza_link.check( uri ) ) return null

			const cert = this.$.$giper_baza_glob.Pawn(
				new this.$.$giper_baza_link( uri ),
				$bog_sert_cert,
			)

			// Ленд чужой и сам собой не приедет: `glob.Pawn` его не синкает.
			cert.land().sync()

			return cert
		}

		shop() {
			return this.cert()?.Shop()?.val() ?? ''
		}

		note() {
			return this.cert()?.Note()?.val() ?? ''
		}

		/** Номинал в рублях. Ноль означает сертификат на услугу. */
		cost() {
			return this.cert()?.Cost()?.val() ?? 0
		}

		/** Что подарено: сумма, услуга, либо и то и другое. */
		gift() {
			const cert = this.cert()
			if( !cert ) return ''
			return $bog_sert_cert.gift_text( this.cost(), cert.title() )
		}

		whom() {
			const whom = this.cert()?.Whom()?.val() ?? ''
			return whom ? `Кому: ${ whom }` : ''
		}

		from() {
			const from = this.cert()?.From()?.val() ?? ''
			return from ? `От кого: ${ from }` : ''
		}

		wish() {
			return this.cert()?.Wish()?.val() ?? ''
		}

		/** Годен до, в человеческом виде. Пусто — без срока. */
		term() {
			const till = this.cert()?.Till()?.val()
			return till ? till.toString( 'DD.MM.YYYY' ) : ''
		}

		legend() {
			const term = this.term()
			if( !term ) return 'Без срока действия'
			return this.expired() ? `Срок вышел ${ term }` : `Действует до ${ term }`
		}

		expired() {
			const till = this.cert()?.Till()?.val()
			if( !till ) return false
			return till.valueOf() < Date.now()
		}

		/** Момент гашения. Пусто — сертификат ещё не использован. */
		used() {
			return this.cert()?.Used()?.val() ?? null
		}

		stamp() {
			const used = this.used()
			if( used ) return `Погашено ${ used.toString( 'DD.MM.YYYY' ) }`
			return this.expired() ? 'Просрочено' : ''
		}

		ident() {
			return this.uri()
		}

		/** Абсолютный адрес этой же карточки — он же содержимое QR-кода и тело письма. */
		page_uri() {
			const uri = this.uri()
			if( !uri ) return ''
			return this.$.$mol_state_arg.link( { screen: null, cert: uri } )
		}

		/** Готовое письмо получателю. Открывается в его почтовой программе. */
		mail_uri() {

			const cert = this.cert()
			if( !cert ) return ''

			const to = cert.Mail()?.val() ?? ''
			const subj = `Подарочный сертификат${ this.shop() ? ' — ' + this.shop() : '' }`

			const body = $bog_sert_cert.mail_body( {
				whom: cert.Whom()?.val() ?? '',
				wish: this.wish(),
				gift: this.gift(),
				legend: this.legend(),
				uri: this.page_uri(),
				note: this.note(),
			} )

			return `mailto:${ encodeURIComponent( to ) }`
				+ `?subject=${ encodeURIComponent( subj ) }`
				+ `&body=${ encodeURIComponent( body ) }`
		}

		/** Гасить может только тот, у кого есть права на запись в ленд сертификата. */
		can_redeem() {

			const cert = this.cert()
			if( !cert ) return false
			if( this.used() ) return false

			// Ранги живут в подарках ленда, а те приезжают только вместе с данными.
			// Без чтения хоть одного поля `can_change` молча ответит «нет».
			cert.Shop()?.val()

			return cert.can_change()
		}

		@ $mol_action
		redeem() {
			const cert = this.cert()
			if( !cert ) return
			cert.Used( 'auto' )!.val( new this.$.$mol_time_moment() )
		}

		@ $mol_action
		copy() {
			this.$.$mol_dom_context.navigator.clipboard.writeText( this.page_uri() )
		}

		override sheet() {
			return [
				this.Head(),
				this.Gift(),
				this.Names(),
				... this.wish() ? [ this.Wish() ] : [],
				this.Foot(),
				... this.stamp() ? [ this.Stamp() ] : [],
			]
		}

		override tools() {
			return [
				this.Mail(),
				this.Copy(),
				... this.can_redeem() ? [ this.Redeem() ] : [],
			]
		}

		override card_rows() {
			if( !this.cert() ) return [ this.Empty() ]
			return [ this.Sheet(), this.Aside(), this.Tools() ]
		}

	}

}
