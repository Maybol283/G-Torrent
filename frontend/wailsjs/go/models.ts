export namespace youtube {
	
	export class Metadata {
	    title: string;
	    duration: number;
	    thumbnail: string;
	    id: string;
	    author: string;
	
	    static createFrom(source: any = {}) {
	        return new Metadata(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.title = source["title"];
	        this.duration = source["duration"];
	        this.thumbnail = source["thumbnail"];
	        this.id = source["id"];
	        this.author = source["author"];
	    }
	}

}

