namespace $ {

	$mol_style_define( $bog_sert_desk_till, {

		Scan: {
			width: '100%',
			maxWidth: '22rem',
			aspectRatio: 1,
			border: {
				radius: $mol_gap.round,
			},
			overflow: 'hidden',
			background: {
				color: $mol_theme.field,
			},
		},

		Manual_apply: {
			alignSelf: 'flex-start',
		},

		Guest: {
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

		Guest_head: {
			font: {
				size: '1.1rem',
				weight: 'bold',
			},
			wordBreak: 'break-all',
		},

		Balance: {
			color: $mol_theme.shade,
		},

		Accrual: {
			font: {
				weight: 'bold',
			},
		},

		Accrue: {
			alignSelf: 'flex-start',
		},

		Spend: {
			alignSelf: 'flex-start',
		},

		Reset: {
			alignSelf: 'flex-start',
		},

	} )

}
