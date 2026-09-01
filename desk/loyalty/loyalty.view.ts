namespace $.$$ {

	/** Настройки программы: сколько возвращать, сколько дарить, во что списывать. */
	export class $bog_sert_desk_loyalty extends $.$bog_sert_desk_loyalty {

		@ $mol_mem
		rate( next?: number ) {
			const val = next === undefined ? undefined : Math.max( 0, Math.min( 100, next ) )
			return this.shop()?.Rate( val )?.val( val ) ?? 0
		}

		@ $mol_mem
		bonus( next?: number ) {
			const val = next === undefined ? undefined : Math.max( 0, Math.round( next ) )
			return this.shop()?.Bonus( val )?.val( val ) ?? 0
		}

		@ $mol_mem
		price( next?: number ) {
			const val = next === undefined ? undefined : Math.max( 0, next )
			return this.shop()?.Price( val )?.val( val ) ?? 1
		}

		/** Пример на круглом чеке, чтобы настройки читались без калькулятора. */
		override sample() {

			const rate = this.rate()
			const price = this.price()
			const gain = $bog_sert_op.accrual( 1000, rate )

			if( !gain ) return 'При нулевом проценте баллы за покупки не начисляются.'

			const back = price > 0 ? ` Это ${ Math.round( gain * price ) } ₽ при списании.` : ''

			return `С чека в 1000 ₽ гость получит ${ gain } баллов.${ back }`
		}

	}

}
