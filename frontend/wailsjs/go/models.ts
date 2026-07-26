export namespace model {
	
	export class Agenda {
	    id: number;
	    title: string;
	    description: string;
	    startAt: string;
	    endAt: string;
	    color: string;
	    alarm: boolean;
	    alarmOffset: number;
	    notifiedAt?: string;
	    createdAt: string;
	    updatedAt: string;
	
	    static createFrom(source: any = {}) {
	        return new Agenda(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.description = source["description"];
	        this.startAt = source["startAt"];
	        this.endAt = source["endAt"];
	        this.color = source["color"];
	        this.alarm = source["alarm"];
	        this.alarmOffset = source["alarmOffset"];
	        this.notifiedAt = source["notifiedAt"];
	        this.createdAt = source["createdAt"];
	        this.updatedAt = source["updatedAt"];
	    }
	}

}

