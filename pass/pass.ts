namespace $ {

	/**
	 * Карта гостя. Заводится самим гостем в собственном ленде, ничего личного
	 * не спрашивает и никакой ценности сама по себе не несёт.
	 *
	 * Операции лежат прямо тут, а не в ленде салона. Так гость видит только
	 * своё, качает только своё, а салон не выставляет наружу список гостей.
	 *
	 * Ленд открыт на запись всем: иначе кассир, у которого свой ключ, не смог
	 * бы начислить. Дописать сюда поэтому может кто угодно, и защищает не право
	 * записи, а подпись: [[$bog_sert_op]] считает только те записи, автор
	 * которых числится в бригаде салона.
	 */
	export class $bog_sert_pass extends $giper_baza_entity.with( {

		// Title — имя, которым гость назвался. Необязательное.

		/** Ленды салонов, где карту заводили. Гость пополняет этот список сам. */
		Shops: $giper_baza_list_str,

		/** Начисления и списания, по всем салонам сразу */
		Ops: $giper_baza_list_link.to( ()=> $bog_sert_op ),

	}, 'Pass' ) {

		/**
		 * Достаёт ссылку карты из чего угодно: полного адреса из камеры, куска
		 * пути или голой ссылки, набранной руками. Мусор отдаёт пустой строкой.
		 */
		static uri_of( raw: string ) {

			const text = ( raw ?? '' ).trim()
			if( !text ) return ''

			// Разделителем считаем любой символ, который не может быть частью
			// имени параметра: иначе `#!pass=` мимо, а `mypass=` наоборот в цель.
			const found = /(?:^|[^a-zA-Z0-9_-])pass=([^/?&#\s]+)/.exec( text )
			const candidate = found ? decodeURIComponent( found[ 1 ] ) : text

			return $giper_baza_link.check( candidate ) ?? ''
		}

		/**
		 * Салоны, которые вписал в карту её владелец.
		 *
		 * Дописать в этот список может кто угодно, как и всё остальное в карте.
		 * Пустяком это не назвать: каждый салон из списка карта потом
		 * синхронизирует, то есть посторонний заставил бы её тянуть любые
		 * ленды, какие назовёт. Поэтому берём только записи того, у кого на
		 * карту полные права, — а это ровно её хозяин.
		 */
		static shops( pass: $bog_sert_pass ): readonly string[] {

			const list = pass.Shops()
			if( !list ) return []

			const land = pass.land()
			const out: string[] = []

			for( const unit of list.units() ) {

				const tier = $giper_baza_rank_tier_of( land.lord_rank( unit.lord() ) )
				if( tier < $giper_baza_rank_tier.rule ) continue

				const uri = String( land.sand_decode( unit ) ?? '' )
				if( !$giper_baza_link.check( uri ) ) continue
				if( out.includes( uri ) ) continue

				out.push( uri )
			}

			return out
		}

	}

}
