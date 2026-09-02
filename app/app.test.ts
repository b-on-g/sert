namespace $ {

	$mol_test( {

		'сертификат на услугу показывает только услугу'() {
			$mol_assert_equal( $bog_sert_cert.gift_text( 0, 'Стрижка' ), 'Стрижка' )
		},

		'сертификат с номиналом показывает и сумму, и услугу'() {
			const text = $bog_sert_cert.gift_text( 3000, 'Стрижка' )
			$mol_assert_ok( text.includes( 'Стрижка' ) )
			$mol_assert_ok( text.includes( '₽' ) )
		},

		'сертификат без услуги показывает одну сумму'() {
			const text = $bog_sert_cert.gift_text( 3000, '' )
			$mol_assert_ok( text.includes( '₽' ) )
			$mol_assert_ok( !text.includes( '·' ) )
		},

		'состояние: погашённый важнее просроченного'() {
			const used = new $mol_time_moment( '2026-01-10' )
			const till = new $mol_time_moment( '2026-01-01' )
			const text = $bog_sert_cert.state_text( used, till, Date.now() )
			$mol_assert_ok( text.startsWith( 'Погашен' ) )
		},

		'состояние: срок в прошлом означает просрочку'() {
			const till = new $mol_time_moment( '2026-01-01' )
			const now = new $mol_time_moment( '2026-06-01' ).valueOf()
			$mol_assert_ok( $bog_sert_cert.state_text( null, till, now ).startsWith( 'Просрочен' ) )
		},

		'состояние: без срока сертификат просто активен'() {
			$mol_assert_equal( $bog_sert_cert.state_text( null, null, Date.now() ), 'Активен' )
		},

		'письмо получателю несёт ссылку на сертификат'() {

			const body = $bog_sert_cert.mail_body( {
				whom: 'Анна',
				wish: 'С днём рождения!',
				gift: '3000 ₽ · Стрижка',
				legend: 'Действует до 01.01.2027',
				uri: 'https://example.com/sert/cert=abcdefgh',
				note: 'Ленина 1',
			} )

			$mol_assert_ok( body.startsWith( 'Анна, здравствуйте!' ) )
			$mol_assert_ok( body.includes( 'https://example.com/sert/cert=abcdefgh' ) )
			$mol_assert_ok( body.includes( 'С днём рождения!' ) )
			$mol_assert_ok( body.includes( 'Ленина 1' ) )
		},

		'письмо без имени и поздравления всё равно осмысленно'() {

			const body = $bog_sert_cert.mail_body( {
				whom: '',
				wish: '',
				gift: 'Стрижка',
				legend: 'Без срока действия',
				uri: 'https://example.com/sert/cert=abcdefgh',
				note: '',
			} )

			$mol_assert_ok( body.startsWith( 'Здравствуйте!' ) )
			$mol_assert_ok( body.includes( 'Дарим вам подарочный сертификат.' ) )

			// Пустые куски не должны оставлять дыр в письме.
			$mol_assert_ok( !body.includes( '\n\n\n' ) )
		},

		'баллы с чека округляются вниз, лишнего не дарим'() {
			$mol_assert_equal( $bog_sert_op.accrual( 1000, 5 ), 50 )
			$mol_assert_equal( $bog_sert_op.accrual( 999, 5 ), 49 )
			$mol_assert_equal( $bog_sert_op.accrual( 1000, 0 ), 0 )
			$mol_assert_equal( $bog_sert_op.accrual( 0, 5 ), 0 )
		},

		'баланс складывается из проверенных операций'() {
			const ledger = [
				{ lord: 'a', at: 1, delta: 100, shop: 's', cost: 0, title: '' },
				{ lord: 'a', at: 2, delta: -30, shop: 's', cost: 0, title: '' },
			]
			$mol_assert_equal( $bog_sert_op.balance( ledger ), 70 )
			$mol_assert_equal( $bog_sert_op.balance( [] ), 0 )
		},

		'списать нельзя больше баланса и дороже чека'() {
			// Баланс 500, чек 200 ₽, балл стоит рубль — дальше чека не спишем.
			$mol_assert_equal( $bog_sert_op.writeoff_limit( 500, 200, 1 ), 200 )
			// Баланс 50 меньше чека — упираемся в баланс.
			$mol_assert_equal( $bog_sert_op.writeoff_limit( 50, 200, 1 ), 50 )
			// Без покупки списывать не из чего.
			$mol_assert_equal( $bog_sert_op.writeoff_limit( 500, 0, 1 ), 0 )
			// Балл в полрубля — на 200 ₽ уходит 400 баллов.
			$mol_assert_equal( $bog_sert_op.writeoff_limit( 500, 200, 0.5 ), 400 )
		},

		'в зачёт идут только записи бригады салона'() {

			// Дописать в карту гостя может кто угодно, поэтому одно и то же поле
			// несёт несколько версий: у каждой свой автор и своё время.
			const land = { sand_decode: ( unit: { val: unknown } )=> unit.val }
			const unit = ( lord: string, time: number, val: unknown )=>
				( { lord: ()=> ({ str: lord }), time: ()=> time, val } )

			const atom = ( units: unknown[] )=> ( {
				land: ()=> land,
				units_of: ()=> units,
			} )

			const op = {
				Delta: ()=> atom([ unit( 'мошенник', 10, 999 ), unit( 'кассир', 20, 50 ) ]),
				Shop: ()=> atom([ unit( 'мошенник', 10, 'чужой' ), unit( 'кассир', 20, 'наш' ) ]),
				Cost: ()=> atom([ unit( 'кассир', 20, 1000 ) ]),
				Title: ()=> atom([ unit( 'кассир', 20, 'Покупка' ) ]),
			} as unknown as $bog_sert_op

			const read = $bog_sert_op.read( op, new Map([[ 'кассир', 0 ]]) )

			$mol_assert_equal( read?.delta, 50 )
			$mol_assert_equal( read?.shop, 'наш' )
			$mol_assert_equal( read?.lord, 'кассир' )
		},

		'запись постороннего не считается ничем'() {

			const land = { sand_decode: ( unit: { val: unknown } )=> unit.val }
			const unit = ( lord: string, time: number, val: unknown )=>
				( { lord: ()=> ({ str: lord }), time: ()=> time, val } )
			const atom = ( units: unknown[] )=> ( { land: ()=> land, units_of: ()=> units } )

			const op = {
				Delta: ()=> atom([ unit( 'гость', 10, 1000000 ) ]),
				Shop: ()=> atom([]),
				Cost: ()=> atom([]),
				Title: ()=> atom([]),
			} as unknown as $bog_sert_op

			$mol_assert_equal( $bog_sert_op.read( op, new Map([[ 'кассир', 0 ]]) ), null )
		},

		'уволенный сохраняет то, что записал, пока работал'() {

			const land = { sand_decode: ( unit: { val: unknown } )=> unit.val }
			const unit = ( lord: string, time: number, val: unknown )=>
				( { lord: ()=> ({ str: lord }), time: ()=> time, val } )
			const atom = ( units: unknown[] )=> ( { land: ()=> land, units_of: ()=> units } )

			const before = {
				Delta: ()=> atom([ unit( 'марина', 100, 50 ) ]),
				Shop: ()=> atom([]), Cost: ()=> atom([]), Title: ()=> atom([]),
			} as unknown as $bog_sert_op

			const after = {
				Delta: ()=> atom([ unit( 'марина', 300, 50 ) ]),
				Shop: ()=> atom([]), Cost: ()=> atom([]), Title: ()=> atom([]),
			} as unknown as $bog_sert_op

			const crew = new Map([[ 'марина', 200 ]])

			$mol_assert_equal( $bog_sert_op.read( before, crew )?.delta, 50 )
			$mol_assert_equal( $bog_sert_op.read( after, crew ), null )
		},

		'в списке салонов карты считаются только записи её хозяина'() {

			// Список открыт на запись, как и вся карта. Записи чужака отбрасываем,
			// иначе карта пошла бы синхронизировать любые ленды, какие он назовёт.
			const unit = ( lord: string, val: string )=>
				( { lord: ()=> lord, val } )

			const land = {
				sand_decode: ( one: { val: string } )=> one.val,
				lord_rank: ( lord: string )=> lord === 'хозяин'
					? $giper_baza_rank_rule
					: $giper_baza_rank_post( 'fast' ),
			}

			const pass = {
				land: ()=> land,
				Shops: ()=> ( {
					units: ()=> [
						unit( 'хозяин', 'aaaaaaaa_bbbbbbbb' ),
						unit( 'чужак', 'cccccccc_dddddddd' ),
						unit( 'хозяин', 'aaaaaaaa_bbbbbbbb' ),
						unit( 'хозяин', 'не ссылка' ),
					],
				} ),
			} as unknown as $bog_sert_pass

			$mol_assert_equal( $bog_sert_pass.shops( pass ), [ 'aaaaaaaa_bbbbbbbb' ] )
		},

		'номер карты вынимается из адреса, набранного как угодно'() {
			const link = 'r7u17HFT_mY9Rf1P0'
			$mol_assert_equal( $bog_sert_pass.uri_of( 'https://example.com/sert/pass=' + link ), link )
			$mol_assert_equal( $bog_sert_pass.uri_of( '#!pass=' + link ), link )
			$mol_assert_equal( $bog_sert_pass.uri_of( '  ' + link + '  ' ), link )
			$mol_assert_equal( $bog_sert_pass.uri_of( 'https://example.com/' ), '' )
			$mol_assert_equal( $bog_sert_pass.uri_of( '' ), '' )
		},

		'имя витрины приводится к скучному виду'() {
			$mol_assert_equal( $bog_sert_name.normal( 'Coffier Shopper' ), 'coffier_shopper' )
			$mol_assert_equal( $bog_sert_name.normal( '  --Кофе--  ' ), '' )
			$mol_assert_equal( $bog_sert_name.normal( 'shop-1' ), 'shop_1' )
		},

		'ссылка сертификата отличается от произвольной строки'() {
			$mol_assert_equal( $giper_baza_link.check( 'это не ссылка' ), null )
			$mol_assert_equal( $giper_baza_link.check( 'abcdefgh_ABCDEFGH' ), 'abcdefgh_ABCDEFGH' )
		},

	} )

}
