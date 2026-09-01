namespace $.$$ {

	/**
	 * Карты, по которым в этом салоне была хоть одна операция.
	 *
	 * Список карт лежит в закрытой части салона, поэтому перечислить гостей
	 * может только тот, кому владелец выдал доступ. Сами операции читаются из
	 * карт: в каждой лежит только своё.
	 */
	export class $bog_sert_desk_guests extends $.$bog_sert_desk_guests {

		cards(): readonly string[] {
			return this.vault()?.Cards()?.items() ?? []
		}

		/** Проверенные операции одной карты в этом салоне. */
		ledger( card: string ): readonly $bog_sert_op_read[] {
			if( !this.$.$giper_baza_link.check( card ) ) return []
			const pass = this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( card ), $bog_sert_pass )
			pass.land().sync()
			return $bog_sert_op.ledger( pass.Ops()?.remote_list() ?? [], this.crew(), this.shop_uri() )
		}

		/** Сводка по каждой карте, недавние сверху. */
		@ $mol_mem
		summary() {
			return this.cards()
				.map( card => {
					const ledger = this.ledger( card )
					const last = ledger[ ledger.length - 1 ]
					return {
						card,
						balance: $bog_sert_op.balance( ledger ),
						visits: ledger.length,
						at: last?.at ?? 0,
						last: last ? new this.$.$mol_time_moment( last.at * 1000 ).toString( 'DD.MM.YYYY' ) : '',
					}
				} )
				.sort( ( a, b )=> b.at - a.at )
		}

		row_uri( card: string ) {
			return card
		}

		row_balance( card: string ) {
			return this.summary().find( row => row.card === card )?.balance ?? 0
		}

		row_visits( card: string ) {
			return this.summary().find( row => row.card === card )?.visits ?? 0
		}

		row_last( card: string ) {
			return this.summary().find( row => row.card === card )?.last ?? ''
		}

		@ $mol_mem
		override guest_rows() {
			return this.summary().map( row => this.Row( row.card ) )
		}

		override guests_title() {
			const count = this.summary().length
			return count ? `Гости — ${ count }` : 'Гости'
		}

		override guests_body() {
			return this.summary().length ? [ this.List() ] : [ this.Empty() ]
		}

	}

}
