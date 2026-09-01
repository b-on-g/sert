namespace $ {

	/**
	 * Операция по карте гостя: начисление, списание или приветственный бонус.
	 *
	 * Лежит внутри ленда салона и подписана его ключом. Гость такую запись
	 * подделать не может — у него нет прав писать в этот ленд.
	 */
	export class $bog_sert_op extends $giper_baza_entity.with( {

		// Title — чем операция была: «покупка», «списание», «приветственный»

		/** Ссылка ленда карты гостя */
		Pass: $giper_baza_atom_text,

		/** Сумма чека в рублях. Ноль, если операция не про покупку. */
		Cost: $giper_baza_atom_real,

		/** Изменение баланса в баллах: плюс начислили, минус списали */
		Delta: $giper_baza_atom_real,

		/** Когда */
		Made: $giper_baza_atom_time,

	}, 'Op' ) {

		/** Баланс карты как сумма всех операций по ней. */
		static balance( ops: readonly $bog_sert_op[], pass: string ) {
			let sum = 0
			for( const op of ops ) {
				if( op.Pass()?.val() !== pass ) continue
				sum += op.Delta()?.val() ?? 0
			}
			return Math.round( sum )
		}

		/** Сколько баллов вернуть с чека. Округляем вниз, чтобы не дарить лишнего. */
		static accrual( cost: number, rate: number ) {
			if( cost <= 0 || rate <= 0 ) return 0
			return Math.floor( cost * rate / 100 )
		}

		/** Потолок списания: не больше баланса и не дороже самого чека. */
		static writeoff_limit( balance: number, cost: number, price: number ) {
			if( balance <= 0 || cost <= 0 ) return 0
			const affordable = price > 0 ? Math.floor( cost / price ) : 0
			return Math.max( 0, Math.min( balance, affordable ) )
		}

	}

}
