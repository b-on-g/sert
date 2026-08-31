namespace $ {

	/**
	 * Подарочный сертификат. Живёт отдельным лендом, ссылка на который и есть предъявитель.
	 * Поэтому всё нужное для показа лежит внутри: получатель открывает карточку,
	 * ничего не зная про ленд салона и не имея к нему доступа.
	 */
	export class $bog_sert_cert extends $giper_baza_entity.with( {

		/** Название салона. Копия, чтобы карточка читалась в отрыве от ленда салона. */
		Shop: $giper_baza_atom_text,

		/** Адрес, телефон, условия. Тоже копия и по той же причине. */
		Note: $giper_baza_atom_text,

		/**
		 * Номинал в рублях. Ноль означает сертификат на услугу из Title.
		 *
		 * Не `$giper_baza_atom_bint`: небольшое целое возвращается из хранилища
		 * числом, а схема bigint приводит число к `null`, и номинал теряется.
		 */
		Cost: $giper_baza_atom_real,

		/** Кому подарок */
		Whom: $giper_baza_atom_text,

		/** От кого подарок */
		From: $giper_baza_atom_text,

		/** Поздравление */
		Wish: $giper_baza_atom_text,

		/** Почта получателя, подставляется в письмо */
		Mail: $giper_baza_atom_text,

		/** Когда выпущен */
		Made: $giper_baza_atom_time,

		/** Годен до */
		Till: $giper_baza_atom_time,

		/** Когда погашен. Пусто — сертификат ещё не использован. */
		Used: $giper_baza_atom_time,

	}, 'Cert' ) {

		/**
		 * Дальше — чистые форматтеры, общие для карточки и строки реестра.
		 * В Базу они не пишут и в фибрах не участвуют, так что запрет на статику
		 * с побочными эффектами их не касается.
		 */

		/** Что подарено, одной строкой: сумма, услуга, либо и то и другое. */
		static gift_text( cost: number, title: string ) {
			if( !cost ) return title
			const money = cost.toLocaleString( 'ru-RU' ) + ' ₽'
			return title ? `${ money } · ${ title }` : money
		}

		/**
		 * Текст письма получателю. Собирается здесь, а не в карточке, чтобы
		 * его можно было проверить тестом, не поднимая ни вида, ни Базы.
		 */
		static mail_body( parts: {
			whom: string,
			wish: string,
			gift: string,
			legend: string,
			uri: string,
			note: string,
		} ) {

			const lines = [
				parts.whom ? `${ parts.whom }, здравствуйте!` : 'Здравствуйте!',
				'',
				parts.wish || 'Дарим вам подарочный сертификат.',
				'',
				parts.gift,
				parts.legend,
				'',
				'Сертификат открывается по ссылке:',
				parts.uri,
				'',
				parts.note,
			]

			return lines.join( '\n' ).replace( /\n{3,}/g, '\n\n' ).trim()
		}

		/** Состояние сертификата словами, для реестра. */
		static state_text(
			used: $mol_time_moment | null,
			till: $mol_time_moment | null,
			now: number,
		) {
			if( used ) return `Погашен ${ used.toString( 'DD.MM.YYYY' ) }`
			if( !till ) return 'Активен'
			if( till.valueOf() < now ) return `Просрочен ${ till.toString( 'DD.MM.YYYY' ) }`
			return `Годен до ${ till.toString( 'DD.MM.YYYY' ) }`
		}

	}

}
