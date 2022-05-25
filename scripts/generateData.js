import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_SAMPLES_PATH } from './util';

/* eslint-disable */
function generateNum(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateStr(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\\';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

function generateObject(depth = 0) {
	if (depth >= MAX_DEPTH) {
		return {};
	}

	const obj = {};
	const propCount = generateNum(1, MAX_PROP_COUNT);

	for (let i = 0; i < propCount; i++) {
		const propType = generateNum(0, 5);
		const prop = generateStr(generateNum(3, 10));
		switch (propType) {
			// String
			case 0: {
				obj[prop] = generateStr(generateNum(3, 50));
				break;
			}

			// Number
			case 1: {
				obj[prop] = generateNum(0, 10000);
				break;
			}

			// Boolean
			case 2: {
				obj[prop] = generateNum(0, 1) === 0;
				break;
			}

			// Null
			case 3: {
				obj[prop] = null;
				break;
			}

			// Object
			case 4: {
				obj[prop] = generateObject(depth + 1);
				break;
			}

			// Array
			case 5:
				const arrayLength = generateNum(1, MAX_PROP_COUNT);
				obj[prop] = new Array(arrayLength).fill().map(() => generateObject(depth + 1));
				break;
		}
	}

	return obj;
}

const [, , name, maxPropCountRaw = 10, maxDepthRaw = 5] = process.argv;

const MAX_PROP_COUNT = parseInt(maxPropCountRaw ?? '10', 10);
const MAX_DEPTH = parseInt(maxDepthRaw ?? '5', 10);

const data = new Array(10).fill().map(() => generateObject());
try {
	readdirSync(DATA_SAMPLES_PATH);
} catch {
	files = [];
	mkdirSync(DATA_SAMPLES_PATH);
}

writeFileSync(join(DATA_SAMPLES_PATH, `${name}.json`), JSON.stringify(data, null, 2));
