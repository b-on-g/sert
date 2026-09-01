namespace $.$$ {

	/** Карты, по которым в этом салоне была хоть одна операция. */
	export class $bog_sert_desk_guests extends $.$bog_sert_desk_guests {

		/** Сводка по каждой карте, недавние сверху. */
		@ $mol_mem
		summary() {

			const rows = new Map< string, { balance: number, visits: number, at: number, last: string } >()

			for( const op of this.ops() ) {

				const pass = op.Pass()?.val() ?? ''
				if( !pass ) continue

				const made = op.Made()?.val()
				const at = made?.valueOf() ?? 0

				const row = rows.get( pass ) ?? { balance: 0, visits: 0, at: 0, last: '' }
				row.balance += op.Delta()?.val() ?? 0
				row.visits += 1

				if( at >= row.at ) {
					row.at = at
					row.last = made?.toString( 'DD.MM.YYYY' ) ?? ''
				}

				rows.set( pass, row )
			}

			return [ ... rows.entries() ]
				.sort( ( a, b )=> b[ 1 ].at - a[ 1 ].at )
				.map( ( [ pass, row ] )=> ( { pass, ... row, balance: Math.round( row.balance ) } ) )
		}

		row_uri( pass: string ) {
			return pass
		}

		row_balance( pass: string ) {
			return this.summary().find( row => row.pass === pass )?.balance ?? 0
		}

		row_visits( pass: string ) {
			return this.summary().find( row => row.pass === pass )?.visits ?? 0
		}

		row_last( pass: string ) {
			return this.summary().find( row => row.pass === pass )?.last ?? ''
		}

		@ $mol_mem
		override guest_rows() {
			return this.summary().map( row => this.Row( row.pass ) )
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
