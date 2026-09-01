namespace $.$$ {

	/**
	 * Витрина салона: то, что видит человек, отсканировавший код на стойке.
	 *
	 * Отсюда заводится карта. Само заведение не начисляет ничего — иначе код на
	 * стойке стал бы фермой баллов, ведь отсканировать его может кто угодно
	 * сколько угодно раз. Баллы даёт касса.
	 */
	export class $bog_sert_front extends $.$bog_sert_front {

		/** Салон по ссылке. Без `@ $mol_mem` — объект Базы. */
		shop() {
			const uri = this.uri()
			if( !this.$.$giper_baza_link.check( uri ) ) return null
			const shop = this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( uri ), $bog_sert_shop )
			shop.land().sync()
			return shop
		}

		/** Домашний ленд гостя: тут лежит указатель на его карту. */
		home() {
			return this.$.$giper_baza_glob.home().land().Data( $bog_sert_home )
		}

		@ $mol_mem
		pass_uri() {
			const home = this.home()
			const kept = home.Passes()?.items() ?? []
			const pointed = home.Pass()?.val()?.str ?? ''
			return pointed || kept.at( -1 ) || ''
		}

		name() {
			return this.shop()?.title() || 'Салон'
		}

		note() {
			return this.shop()?.Note()?.val() ?? ''
		}

		override terms() {

			const shop = this.shop()
			if( !shop ) return ''

			const rate = shop.Rate()?.val() ?? 0
			const bonus = Math.round( shop.Bonus()?.val() ?? 0 )

			const lines = [ '## Карта гостя', '' ]

			if( rate > 0 ) lines.push( `Возвращаем ${ rate }% от чека баллами.` )
			if( bonus > 0 ) lines.push( `За первый визит начислим ${ bonus } приветственных баллов.` )
			if( !rate && !bonus ) lines.push( 'Заведите карту, чтобы копить баллы за покупки.' )

			lines.push( '', 'Баллы начисляет кассир, когда сканирует вашу карту.' )

			return lines.join( '\n' )
		}

		/**
		 * Карта заводится только по нажатию и только тут.
		 *
		 * Заведение ленда стоит доказательства работы, поэтому в `auto()` его
		 * делать нельзя: на каждом холодном старте, пока указатель не приехал,
		 * заводилась бы новая карта.
		 */
		@ $mol_action
		join() {

			const shop_uri = this.uri()
			if( !shop_uri ) return

			// Подвисающие чтения — до записи.
			const home = this.home()
			home.Passes()?.items()
			const own = this.pass_uri()

			const pass = own
				? this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( own ), $bog_sert_pass )
				: this.pass_make( home )

			// Салон в карту дописывает гость: писать в его ленд салон не вправе.
			pass.Shops( 'auto' )!.add( shop_uri )

			this.$.$mol_state_arg.go( { bz: null, bzname: null, pass: pass.link().str } )
		}

		@ $mol_action
		pass_make( home: $bog_sert_home ) {

			const land = this.$.$giper_baza_glob.land_grab( [
				[ null, this.$.$giper_baza_rank_read ],
			] )

			const pass = land.Data( $bog_sert_pass )

			home.Pass( 'auto' )!.remote( pass )
			home.Passes( 'auto' )!.add( pass.link().str )

			return pass
		}

		override front_rows() {

			if( !this.shop() ) return [ this.Empty() ]

			return [
				this.Head(),
				this.Terms(),
				this.Join(),
				... this.pass_uri() ? [ this.Open() ] : [],
				this.Foot(),
			]
		}

	}

}
