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

		'ссылка сертификата отличается от произвольной строки'() {
			$mol_assert_equal( $giper_baza_link.check( 'это не ссылка' ), null )
			$mol_assert_equal( $giper_baza_link.check( 'abcdefgh_ABCDEFGH' ), 'abcdefgh_ABCDEFGH' )
		},

	} )

}
