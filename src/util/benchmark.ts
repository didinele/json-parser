import { performance } from 'perf_hooks';

interface BenchmarkOptions {
	root: string | symbol;
	digits?: number;
}

interface BenchmarkMetadata extends BenchmarkOptions {
	methods: Map<string | symbol, Method>;
}

interface Method {
	name: string;
	timeTaken: number;
}

interface MethodOptions {
	ignore?: boolean;
}

const METADATA = new WeakMap<Object, BenchmarkMetadata>();

export function formatTime(time: number, digits: number) {
	if (time >= 1000) {
		return `${(time / 1000).toFixed(digits)}s`;
	}
	if (time >= 1) {
		return `${time.toFixed(digits)}ms`;
	}
	return `${(time * 1000).toFixed(digits)}μs`;
}

export function benchmarkable(options: BenchmarkOptions): ClassDecorator {
	return function benchmarkable(target: Object) {
		METADATA.set(target, { ...options, methods: new Map() });
	};
}

export function benchmark(options?: MethodOptions): MethodDecorator {
	return function benchmark(target: Object, method: string | symbol, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value as (...args: unknown[]) => unknown;
		const name = typeof method === 'string' ? method : `<symbol "${method.description ?? 'no description'}">`;

		descriptor.value = function value(...args: unknown[]) {
			const metadata = METADATA.get(target.constructor);
			if (!metadata) {
				throw new Error('Non benchmarkable class');
			}

			if (options?.ignore) {
				return originalMethod.call(this, ...args);
			}

			let method = metadata.methods.get(name);
			if (!method) {
				method = { name, timeTaken: 0 };
				metadata.methods.set(name, method);
			}

			const start = performance.now();
			const result = originalMethod.call(this, ...args);
			const end = performance.now();

			method.timeTaken += end - start;

			if (method.name === metadata.root) {
				console.log(`${method.name} took ${formatTime(method.timeTaken, metadata.digits ?? 3)}`);
				for (const method of metadata.methods.values()) {
					if (method.name === metadata.root) {
						continue;
					}

					console.log(`  - ${method.name} took ${formatTime(method.timeTaken, metadata.digits ?? 3)}`);
				}
			}

			return result;
		};
	};
}
