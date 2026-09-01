namespace $.$$ {

	/** Реквизиты салона и адрес его витрины. */
	export class $bog_sert_desk_shop extends $.$bog_sert_desk_shop {

		@ $mol_mem
		shop_name( next?: string ) {
			return this.shop()?.title( next ) ?? ''
		}

		@ $mol_mem
		shop_note( next?: string ) {
			return this.shop()?.Note( next )?.val( next ) ?? ''
		}

		@ $mol_mem
		shop_term( next?: number ) {
			const term = next === undefined ? undefined : Math.max( 0, Math.round( next ) )
			return this.shop()?.Term( term )?.val( term ) ?? 6
		}

		/** Адрес витрины: по имени, если оно наше, иначе по самому ленду. */
		address() {

			const uri = this.shop_uri()
			if( !uri ) return ''

			const name = this.name_own() ? this.shop()?.Name()?.val() ?? '' : ''

			return name
				? this.$.$mol_state_arg.link( { page: null, bz: null, bzname: name } )
				: this.$.$mol_state_arg.link( { page: null, bzname: null, bz: uri } )
		}

		@ $mol_action
		address_copy() {
			this.$.$mol_dom_context.navigator.clipboard.writeText( this.address() )
		}

		/** Словарь реестра имён. Пусто, если реестр не заведён. */
		names() {
			const land = $bog_sert_name.land
			if( !this.$.$giper_baza_link.check( land ) ) return null
			const dict = this.$.$giper_baza_glob.Land( new this.$.$giper_baza_link( land ) ).Data( $bog_sert_name )
			dict.land().sync()
			return dict
		}

		/**
		 * Что набрали в поле. Приводить к скучному виду прямо тут нельзя:
		 * тогда подчёркивание на конце срезается на каждом нажатии, и набрать
		 * `coffier_shopper` становится невозможно.
		 */
		@ $mol_mem
		claim_raw( next?: string ) {
			if( next !== undefined ) return next
			return this.shop()?.Name()?.val() ?? ''
		}

		/** Имя, каким оно станет в адресе. */
		claim() {
			return $bog_sert_name.normal( this.claim_raw() )
		}

		/** Заявки на введённое имя, ранняя первой. */
		claims() {
			const dict = this.names()
			const name = this.claim()
			if( !dict || !name ) return []
			return $bog_sert_name.claims( dict, name )
		}

		/** Имя наше, если самая ранняя заявка ведёт на наш салон. */
		name_own() {
			const uri = this.shop_uri()
			if( !uri ) return false
			return this.claims()[ 0 ]?.shop === uri
		}

		override claim_status() {

			if( !this.names() ) return 'Реестр имён не подключён, работает адрес по салону'

			const name = this.claim()
			if( !name ) return ''

			const raw = this.claim_raw().trim()
			const shown = raw === name ? '' : ` В адресе это будет «${ name }».`

			const claims = this.claims()
			if( !claims.length ) return 'Имя свободно.' + shown

			if( this.name_own() ) {
				return claims.length > 1
					? 'Имя ваше, но на него претендует кто-то ещё'
					: 'Имя занято вами'
			}

			return 'Имя уже заняли раньше вас, адрес по нему уйдёт не к вам'
		}

		override claim_allowed() {
			if( !this.names() ) return false
			const name = this.claim()
			if( !name ) return false
			return !this.claims().length || this.name_own()
		}

		@ $mol_action
		claim_take() {

			const dict = this.names()
			const shop = this.shop()
			if( !dict || !shop ) return

			// Подвисающие чтения — до записи.
			const name = this.claim()
			const uri = this.shop_uri()
			if( !name || !uri ) return
			this.claims()

			dict.key( name, 'auto' )!.val( uri )
			shop.Name( 'auto' )!.val( name )
		}

		override address_rows() {
			if( !this.shop_uri() ) return []
			return [
				this.Address_title(),
				this.Address_hint(),
				this.Address_value(),
				this.Address_copy(),
				this.Code(),
			]
		}

	}

}
