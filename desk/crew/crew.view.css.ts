namespace $ {

	$mol_style_define( $bog_sert_desk_crew, {

		Hint: {
			color: $mol_theme.shade,
		},

		Add_block: {
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

		Key: {
			minHeight: '4rem',
			fontFamily: 'monospace',
			font: {
				size: '.8rem',
			},
		},

		Add: {
			alignSelf: 'flex-start',
		},

		List: {
			flex: {
				direction: 'column',
			},
			gap: '1px',
		},

	} )

}
