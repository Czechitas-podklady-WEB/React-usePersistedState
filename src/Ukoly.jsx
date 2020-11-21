import React, { useState } from 'react'
import { usePersistedState } from './usePersistedState'

export const Ukoly = () => {
	const [polozky, setPolozky] = usePersistedState([], 'ukoly')
	const [vstup, setVstup] = useState('')

	return (
		<section>
			<h1>Úkoly</h1>
			<ul>
				{polozky.map((polozka, i) => (
					<li key={i}>
						{polozka}{' '}
						<button
							onClick={() => {
								const novePolozky = [...polozky]
								novePolozky.splice(i, 1)
								setPolozky(novePolozky)
							}}
						>
							splnit
						</button>
					</li>
				))}
			</ul>
			<form
				onSubmit={(event) => {
					event.preventDefault()
					const novePolozky = [...polozky, vstup]
					setPolozky(novePolozky)
					setVstup('')
				}}
			>
				<label>
					Název:{' '}
					<input
						required
						value={vstup}
						onChange={(event) => setVstup(event.target.value)}
					/>
				</label>
				<button>Přidat</button>
			</form>
		</section>
	)
}
