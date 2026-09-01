namespace $ {

	$mol_style_define( $bog_sert_desk_shop, {

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

		Address_block: {
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

		Claim_block: {
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

		Address_title: {
			font: {
				size: '1.1rem',
				weight: 'bold',
			},
		},

		Claim_title: {
			font: {
				size: '1.1rem',
				weight: 'bold',
			},
		},

		Address_value: {
			fontFamily: 'monospace',
			font: {
				size: '.85rem',
			},
			wordBreak: 'break-all',
		},

		Address_copy: {
			alignSelf: 'flex-start',
		},

		Claim_take: {
			alignSelf: 'flex-start',
		},

		Code: {
			width: '12rem',
			height: '12rem',
			flex: {
				grow: 0,
				shrink: 0,
			},
		},

	} )

}
