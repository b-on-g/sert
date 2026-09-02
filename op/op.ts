namespace $ {

	/** Бригада салона: лорд сотрудника → момент увольнения в секундах, ноль если работает. */
	export type $bog_sert_op_crew = ReadonlyMap< string, number >

	/** Операция, прочитанная с проверенной подписью. */
	export type $bog_sert_op_read = {
		lord: string
		at: number
		delta: number
		shop: string
		cost: number
		title: string
	}

	/**
	 * Операция по карте гостя: начисление, списание или приветственный бонус.
	 *
	 * Лежит в ленде карты, а не салона. Ленд карты открыт на запись всем, иначе
	 * кассир со своим ключом не смог бы туда ничего положить. Значит право
	 * записи ничего не гарантирует, и доверие держится на подписи: у каждой
	 * записи в Базе есть автор, и в зачёт идут только записи бригады салона.
	 *
	 * Гость может дописать себе хоть миллион баллов — его лорда нет в бригаде,
	 * и такая запись не считается ничем.
	 */
	export class $bog_sert_op extends $giper_baza_entity.with( {

		// Title — чем операция была: «Покупка», «Списание», «Приветственный»

		/** Ленд салона, который начислил. Карта работает в нескольких сразу. */
		Shop: $giper_baza_atom_text,

		/** Сумма чека в рублях. Ноль, если операция не про покупку. */
		Cost: $giper_baza_atom_real,

		/** Изменение баланса в баллах: плюс начислили, минус списали */
		Delta: $giper_baza_atom_real,

		// Поля «когда» тут намеренно нет. Время берётся из самого юнита
		// (`unit.time()`): оно часть подписи, и посторонний его не подменит.
		// Отдельное поле пришлось бы читать наравне со всеми, а значит и
		// проверять, — лишняя сущность ради того, что уже есть.

	}, 'Op' ) {

		/**
		 * Операция глазами того, кто ей верит.
		 *
		 * Читаем не `val()`, а все версии поля: `val()` отдаёт первую попавшуюся,
		 * а в карту гостя мог дописать посторонний, и его ветка легла бы раньше.
		 * Автор определяется по `Delta` — именно это поле несёт ценность, — и
		 * остальные поля берутся из записей того же автора.
		 *
		 * Возвращает `null`, если операцию не подписал никто из бригады.
		 */
		static read( op: $bog_sert_op, crew: $bog_sert_op_crew ): null | $bog_sert_op_read {

			const delta_atom = op.Delta()
			if( !delta_atom ) return null

			const land = delta_atom.land()

			for( const unit of delta_atom.units_of( null ) ) {

				const lord = unit.lord().str
				const fired = crew.get( lord )

				// Не из бригады — мимо.
				if( fired === undefined ) continue

				// Уволенный сохраняет то, что записал, пока работал.
				if( fired && unit.time() >= fired ) continue

				const delta = land.sand_decode( unit )
				if( typeof delta !== 'number' ) continue

				const by = ( atom: null | $giper_baza_atom )=> {
					if( !atom ) return null
					for( const one of atom.units_of( null ) ) {
						if( one.lord().str !== lord ) continue
						return land.sand_decode( one )
					}
					return null
				}

				return {
					lord,
					at: unit.time(),
					delta,
					shop: String( by( op.Shop() ) ?? '' ),
					cost: Number( by( op.Cost() ) ?? 0 ),
					title: String( by( op.Title() ) ?? '' ),
				}
			}

			return null
		}

		/** Проверенные операции карты в одном салоне, ранние первыми. */
		static ledger(
			ops: readonly $bog_sert_op[],
			crew: $bog_sert_op_crew,
			shop: string,
		): readonly $bog_sert_op_read[] {

			const out: $bog_sert_op_read[] = []

			for( const op of ops ) {
				const read = $bog_sert_op.read( op, crew )
				if( !read ) continue
				if( shop && read.shop !== shop ) continue
				out.push( read )
			}

			return out.sort( ( a, b )=> a.at - b.at )
		}

		/** Баланс как сумма проверенных операций. */
		static balance( ledger: readonly $bog_sert_op_read[] ) {
			let sum = 0
			for( const one of ledger ) sum += one.delta
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
