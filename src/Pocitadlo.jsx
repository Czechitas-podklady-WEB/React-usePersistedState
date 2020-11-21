import React from 'react'
import { usePersistedState } from './usePersistedState'

export const Pocitadlo = () => {
	const [pocitadlo, setPocitadlo] = usePersistedState(0, 'pocitadlo')

	return (
		<section>
			<h1>Počítadlo</h1>
			<div>Stav: {pocitadlo}</div>
			<button onClick={() => setPocitadlo(pocitadlo + 1)}>+</button>
			<button onClick={() => setPocitadlo(pocitadlo - 1)}>-</button>
		</section>
	)
}
