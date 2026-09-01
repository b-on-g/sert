namespace $.$$ {

	/**
	 * Кабинет владельца: реквизиты, выпуск сертификатов, касса, гости, ключ.
	 * Каждый раздел отдельной страницей, потому что кассир и бухгалтер открывают
	 * разное и им нечего листать мимо друг друга.
	 */
	export class $bog_sert_desk extends $.$bog_sert_desk {

		/**
		 * Домашний ленд: указатели на свой салон и свою карту гостя.
		 * Без `@ $mol_mem` — объект Базы.
		 */
		home() {
			return this.$.$giper_baza_glob.home().land().Data( $bog_sert_home )
		}

		/**
		 * Ссылка своего салона.
		 *
		 * Указатель читаем первым, но если он пуст, берём последний из списка
		 * заведённых. Указатель перетирается записью, легшей позже, а список
		 * сливается — на холодном старте второе устройство иначе решит, что
		 * салона нет, и заведёт себе второй.
		 */
		@ $mol_mem
		override shop_uri() {
			const home = this.home()
			const kept = home.Shops()?.items() ?? []
			const pointed = home.Shop()?.val()?.str ?? ''
			return pointed || kept.at( -1 ) || ''
		}

		/** Ссылка своей карты гостя, если владелец успел её завести. */
		@ $mol_mem
		override pass_uri() {
			const home = this.home()
			const kept = home.Passes()?.items() ?? []
			const pointed = home.Pass()?.val()?.str ?? ''
			return pointed || kept.at( -1 ) || ''
		}

		/**
		 * Салон заводится только по нажатию и только тут.
		 *
		 * В `auto()` этого делать нельзя: там оно случится на каждом холодном
		 * старте, пока указатель не приехал, и салоны начнут размножаться.
		 */
		@ $mol_action
		shop_make() {

			// Подвисающие чтения — до записи, иначе первое нажатие уйдёт впустую.
			const home = this.home()
			home.Shops()?.items()

			const land = this.$.$giper_baza_glob.land_grab( [
				[ null, this.$.$giper_baza_rank_read ],
			] )

			const shop = land.Data( $bog_sert_shop )
			shop.Term( 'auto' )!.val( 6 )
			shop.Rate( 'auto' )!.val( 5 )
			shop.Bonus( 'auto' )!.val( 0 )
			shop.Price( 'auto' )!.val( 1 )

			// Пустой пресет означает, что прав для `null` нет, и База шифрует ленд.
			// Стоит ей увидеть хоть какие-то права для всех, и шифрование выключается.
			const vault = this.$.$giper_baza_glob.land_grab( [] ).Data( $bog_sert_vault )
			shop.Vault( 'auto' )!.remote( vault )

			// Владелец — первый в бригаде, иначе его же записи никто не зачтёт.
			const owner = shop.Crew( 'auto' )!.make( null )
			owner.Title( 'auto' )!.val( 'Владелец' )
			owner.Lord( 'auto' )!.val( this.$.$giper_baza_auth.current().pass().lord().str )

			home.Shop( 'auto' )!.remote( shop )
			home.Shops( 'auto' )!.add( shop.link().str )

			this.spread( 'shop' )
		}

		override start_body() {
			if( !this.shop_uri() ) return [ this.Intro(), this.Make() ]
			return [ this.owner() ? this.Ready() : this.Hired() ]
		}

		/**
		 * Я владелец этого салона или наёмный работник?
		 *
		 * У сотрудника прав на ленд витрины нет: ему выдали доступ к закрытой
		 * части и место в бригаде, а править реквизиты и условия он не должен.
		 */
		owner() {

			const uri = this.shop_uri()
			if( !uri ) return false

			const shop = this.$.$giper_baza_glob.Pawn( new this.$.$giper_baza_link( uri ), $bog_sert_shop )

			// Ранги живут в подарках ленда, а те приезжают только вместе с данными.
			// Без чтения хоть одного поля `can_change` молча ответит «нет».
			shop.Title()?.val()

			return shop.can_change()
		}

		/** Пока салона нет, разделы кабинета показывать нечего. */
		@ $mol_mem
		override spread_ids() {

			if( !this.shop_uri() ) return []

			const all = super.spread_ids()
			if( this.owner() ) return all

			return all.filter( id => [ 'till', 'guests', 'key' ].includes( id ) )
		}

		override menu_tools() {
			return this.pass_uri() ? [ this.Pass_link() ] : []
		}

		override spread_title( spread: string ) {
			const titles: Record< string, string > = {
				shop: 'Салон',
				issue: 'Выпустить сертификат',
				certs: 'Выданные',
				loyalty: 'Лояльность',
				till: 'Касса',
				guests: 'Гости',
				crew: 'Сотрудники',
				key: 'Ключ доступа',
			}
			return titles[ spread ] ?? super.spread_title( spread )
		}

	}

}
