import { Application, Request, Response } from 'express';

const validTypes: string[] = ['info', 'critical'];
import fs from 'fs';

export default function(app: Application): void {

	app.get('/status', (req: Request, res: Response) => {
		const upTime = global.process.uptime();
		const hour = formatToTime(Math.floor(upTime / 3600));
		const min = formatToTime(Math.floor(upTime % 3600 / 60));
		const second = formatToTime(Math.floor(upTime % 3600 % 60));

		res.send(`${hour}:${min}:${second}`);
	});

	app.get('/api/events', (req: Request, res: Response) => {
		try {
			const events = getEvents(req.query);

			res.send(events);
		} catch (err) {
			res.sendStatus((err === 'TypeError') ? 400 : 500);
		}
	});

	app.post('/api/events', (req: Request, res: Response) => {
		try {
			const events = getEvents(req.query);

			// Использовать эту строку, вместо предыдущей, если
			// нужно принимать параметры из тела запроса
			// let events = getEvents(req.body);

			res.send(events);
		} catch (err) {
			res.sendStatus((err === 'TypeError') ? 400 : 500);
		}
	});

	app.use('*', (req: Request, res: Response) => {
		res.status(404).send('<h1>Page not found</h1');
	});

}

function formatToTime(val: number): string {
	return (val < 10) ? `0${val}` : `${val}`;
}

interface IOptions {
	page?: number;
	perPage?: number;
	type?: string;
}

function getEvents({type, page, perPage = 25}: IOptions): object[] {

	let types: string[] = [];

	if (page) {
		page = +page;
	}

	if (perPage) {
		perPage = +perPage || 5;
	}

	if (type) {
		types = type.split(':');

		for (const item of types) {
			if (!validTypes.includes(item)) { throw new Error('TypeError');
		} }
	}

	let events;

	try {
		events = JSON.parse(fs.readFileSync('events.json').toString()).events;
	} catch (err) {
		throw new Error('ServerError');
	}

	if (!events) { throw new Error('ServerError'); }

	if (types.length > 0) {
		const tmp = [];

		for (const event of events) {
			if (types.includes(event.type)) {
				tmp.push(event);
			}
		}

		events = tmp;
	}

	if (page) {
		if (page < 0 || !Number.isInteger(page)) { throw new Error('TypeError'); }

		events = events.slice((page - 1) * perPage, page * perPage);

		if (events.length === 0) { throw new Error('TypeError'); }
	}

	return events;
}
