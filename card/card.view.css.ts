namespace $ {

	$mol_style_define( $bog_sert_card, {

		flex: {
			direction: 'column',
		},
		align: {
			items: 'center',
		},
		gap: $mol_gap.block,
		padding: $mol_gap.block,
		maxWidth: '32rem',
		width: '100%',
		margin: {
			left: 'auto',
			right: 'auto',
		},

		Head: {
			flex: {
				direction: 'column',
			},
			align: {
				items: 'center',
			},
			gap: '.25rem',
		},

		Kind: {
			font: {
				size: '.75rem',
			},
			letterSpacing: '.15em',
			textTransform: 'uppercase',
			color: $mol_theme.shade,
		},

		Total: {
			font: {
				size: '2rem',
				weight: 'bold',
			},
		},

		Code: {
			width: '14rem',
			height: '14rem',
			flex: {
				grow: 0,
				shrink: 0,
			},
		},

		Ident: {
			flex: {
				direction: 'column',
			},
			align: {
				items: 'center',
			},
			gap: '.125rem',
		},

		Ident_label: {
			font: {
				size: '.75rem',
			},
			color: $mol_theme.shade,
		},

		Ident_value: {
			fontFamily: 'monospace',
			wordBreak: 'break-all',
		},

		Shops: {
			flex: {
				direction: 'column',
			},
			gap: '1px',
			width: '100%',
		},

		Save: {
			font: {
				size: '.85rem',
			},
			color: $mol_theme.shade,
		},

	} )

}
