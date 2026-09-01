namespace $ {

	$mol_style_define( $bog_sert_desk_issue, {

		Form: {
			flex: {
				direction: 'column',
			},
			gap: $mol_gap.text,
			padding: $mol_gap.block,
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
		},

		Issue: {
			alignSelf: 'flex-start',
			margin: {
				top: $mol_gap.text,
			},
		},

		Last_block: {
			flex: {
				direction: 'column',
			},
			gap: $mol_gap.text,
		},

		Last_title: {
			font: {
				size: '1.1rem',
				weight: 'bold',
			},
		},

		Last_sheet: {
			padding: 0,
		},

		Wish: {
			minHeight: '4rem',
		},

	} )

}
