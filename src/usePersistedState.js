import { useEffect, useMemo, useState } from 'react'

export const usePersistedState = (initialState, key) => {
	// Kontroluje, jestli je funkce volaná správně i s druhý argumentem
	if (typeof key !== 'string') {
		// Pokud ne, zobrazí do konzole error
		throw new Error('Argument "key" must be string')
	}

	// Přichystá interní stav. Pokud je to potřeba, načte poslední hodnotu z localStorage nebo použije dodanou v proměnné initialState
	const [rawState, setRawState] = useState(() => loadJSON(key, initialState))

	// Při prvním renderu komponenty přidá posluchače událostí
	useEffect(() => {
		// Funkce pro zpracování události změny v localStorage způsobené jiným tabem
		const onOtherTabChange = (event) => {
			if (event.key === key) {
				setRawState(loadJSON(key, initialState))
			}
		}
		// Pro změny z aktuálního tabu
		const onThisTabChange = () => {
			setRawState(loadJSON(key, initialState))
		}

		// Přidání posluchaču
		window.addEventListener('storage', onOtherTabChange)
		window.addEventListener('this-tab-storage', onThisTabChange)

		// Odebrání posluchačů po odebrání komponenty ze stránky
		return () => {
			window.removeEventListener('storage', onOtherTabChange)
			window.removeEventListener('this-tab-storage', onThisTabChange)
		}
	}, [key])

	// Funkce pro změnu stavu, která ukládá do localStorage a doupozorní všechny komponenty, že se stav změnil
	const setState = (value) => {
		// V localStorage můžou být jako hodnoty jen řetězce. Proto převedeme data (value) do jsonu
		saveJSON(key, JSON.stringify(value))
		// Uložení do localStorage upozorňuje jen ostatní taby. Vytvoříme vlastní událost, která upozorní i tab, ve kterém zrovna jsme
		window.dispatchEvent(new Event('this-tab-storage'))
	}

	// Do proměnné state vytáhneme data z localStorage. Pomocí hooku useMemo optimalizujeme výkon a data zpracováváme pouze v případě, že jsou jiné než při předchozím renderu
	const state = useMemo(() => {
		// Pomocí try a catch zkusíme převést data z jsonu do původní struktury
		try {
			return JSON.parse(rawState)
		} catch (error) {
			// Pokud se převod nepovede, zapíšeme do konzole, že data jsou ve špatném formátu
			console.error('Corrupted localStorage data. Falling back to initialState')
			console.error(error)
		}
		// Vrátíme počáteční data, pokud selhal převod z jsonu
		return initialState
	}, [rawState])

	return [state, setState]
}

// Funce pro čtení z localStorage. Vrací počáteční hodnotu, pokud v localStorage pod daným klíčem ještě nejsou žádná data
const loadJSON = (key, fallbackValue) => {
	const data = localStorage.getItem(key)
	// Data se rovnají null, pokud v localStorage ještě žádná nejsou
	if (data === null) {
		return JSON.stringify(fallbackValue)
	}
	return data
}

// Ukládá do localStorage
const saveJSON = (key, value) => {
	localStorage.setItem(key, value)
}
