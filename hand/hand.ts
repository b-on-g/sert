namespace $ {

	/**
	 * Сотрудник, которому разрешено начислять баллы.
	 *
	 * Список сотрудников лежит в открытом ленде витрины намеренно: по нему
	 * гость проверяет, что запись в его карте сделал кто-то из салона, а не
	 * посторонний. Секрета тут нет, публичный ключ на то и публичный.
	 */
	export class $bog_sert_hand extends $giper_baza_entity.with( {

		// Title — как зовут, для списка в кабинете

		/** Лорд сотрудника: по нему сходится подпись записи */
		Lord: $giper_baza_atom_text,

		/** Когда уволен. Записи, сделанные до этого момента, остаются в силе. */
		Fired: $giper_baza_atom_time,

	}, 'Hand' ) {

		/**
		 * Бригада салона списком «лорд → момент увольнения в секундах».
		 * Ноль означает, что человек работает.
		 *
		 * Секунды, а не миллисекунды: в этих же единицах живёт `unit.time()`,
		 * с которым бригаду и сверяют.
		 */
		static crew( shop: null | $bog_sert_shop ): $bog_sert_op_crew {

			const crew = new Map< string, number >()
			if( !shop ) return crew

			for( const hand of shop.Crew()?.remote_list() ?? [] ) {

				const lord = hand.Lord()?.val() ?? ''
				if( !lord ) continue

				const fired = hand.Fired()?.val()
				crew.set( lord, fired ? Math.floor( fired.valueOf() / 1000 ) : 0 )
			}

			return crew
		}

	}

}
