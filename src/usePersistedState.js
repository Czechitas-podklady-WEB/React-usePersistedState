import { useCallback, useEffect, useMemo, useState } from 'react'

export const usePersistedState = (
	initialState,
	key,
	storage = localStorage, // localStorage nebo sessionStorage
) => {
	// Kontroluje, jestli je funkce volaná správně i s druhý argumentem
	if (typeof key !== 'string') {
		// Pokud ne, zobrazí do konzole error
		throw new Error('Argument "key" must be string')
	}

	// Přichystá interní stav. Pokud je to potřeba, načte poslední hodnotu z localStorage nebo použije dodanou v proměnné initialState
	const [rawState, setRawState] = useState(() =>
		loadJSON(storage, key, initialState),
	)

	// Při prvním renderu komponenty přidá posluchače událostí
	useEffect(() => {
		// Funkce pro zpracování události změny v localStorage
		const onChange = (event) => {
			// Zkontrolujeme, jestli se změnily data, která nás zajímají
			if (
				(event instanceof CustomEvent ? event.detail.key : event.key) === key
			) {
				setRawState(loadJSON(storage, key, initialState))
			}
		}

		// Přidání posluchaču
		window.addEventListener('storage', onChange)
		window.addEventListener('this-tab-storage', onChange)

		// Odebrání posluchačů po odebrání komponenty ze stránky
		return () => {
			window.removeEventListener('storage', onChange)
			window.removeEventListener('this-tab-storage', onChange)
		}
	}, [key, storage])

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

	// Funkce pro změnu stavu, která ukládá do localStorage a doupozorní všechny komponenty, že se stav změnil
	const setState = useCallback(
		(value) => {
			// Stejně jako useState i usePersistedState podporuje ve value funkci pro práci s předchozí hodnotou
			const valueToStore = value instanceof Function ? value(state) : value
			// V localStorage můžou být jako hodnoty jen řetězce. Proto převedeme data (value) do jsonu
			saveJSON(storage, key, JSON.stringify(valueToStore))
			// Uložení do localStorage upozorňuje jen ostatní taby. Vytvoříme vlastní událost, která upozorní i tab, ve kterém zrovna jsme
			window.dispatchEvent(
				new CustomEvent('this-tab-storage', {
					detail: {
						key,
					},
				}),
			)
		},
		[key, state, storage],
	)

	return [state, setState]
}

// Funce pro čtení z localStorage. Vrací počáteční hodnotu, pokud v localStorage pod daným klíčem ještě nejsou žádná data
const loadJSON = (storage, key, fallbackValue) => {
	const data = storage.getItem(key)
	// Data se rovnají null, pokud v localStorage ještě žádná nejsou
	if (data === null) {
		return JSON.stringify(fallbackValue)
	}
	return data
}

// Ukládá do localStorage
const saveJSON = (storage, key, value) => {
	storage.setItem(key, value)
}
