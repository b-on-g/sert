namespace $ {

	$mol_style_define( $bog_sert_key, {

		flex: {
			direction: 'column',
		},
		gap: $mol_gap.block,
		padding: $mol_gap.block,
		maxWidth: '42rem',
		width: '100%',
		margin: {
			left: 'auto',
			right: 'auto',
		},

		Public: {
			fontFamily: 'monospace',
			font: {
				size: '.8rem',
			},
			minHeight: '4rem',
		},

		Public_copy: {
			alignSelf: 'flex-start',
		},

		Public_hint: {
			color: $mol_theme.shade,
			font: {
				size: '.85rem',
			},
		},

		Mine: {
			fontFamily: 'monospace',
			font: {
				size: '.8rem',
			},
			minHeight: '6rem',
		},

		Other: {
			fontFamily: 'monospace',
			font: {
				size: '.8rem',
			},
			minHeight: '6rem',
		},

		Copy: {
			alignSelf: 'flex-start',
		},

		Enter: {
			alignSelf: 'flex-start',
		},

	} )

}
