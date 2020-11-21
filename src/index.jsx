import React from 'react'
import { render } from 'react-dom'
import './index.html'
import { Pocitadlo } from './Pocitadlo'
import { Ukoly } from './Ukoly'

render(
	<>
		<header>
			<h1>React usePersistedState</h1>
		</header>
		<main>
			<Pocitadlo />
			<Ukoly />
			<Ukoly />
		</main>
	</>,
	document.querySelector('#app'),
)
