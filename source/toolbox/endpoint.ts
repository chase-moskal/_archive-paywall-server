
import * as Koa from "koa"
import * as koaMount from "koa-mount"

export const endpoint = (path: string, koa: Koa, port: number) =>
	new Koa()
		.use(koaMount(path, koa))
		.listen(port)
