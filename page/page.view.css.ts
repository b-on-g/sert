namespace $ {

	/** Общая раскладка всех страниц кабинета: одна колонка разумной ширины. */
	$mol_style_define( $bog_sert_page, {

		Body_content: {
			flex: {
				direction: 'column',
			},
			gap: $mol_gap.block,
			maxWidth: '34rem',
			width: '100%',
		},

	} )

}
