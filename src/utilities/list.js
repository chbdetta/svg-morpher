class List {
	constructor() {
		this.head = this.tail = null;
		this.length = 0;
	}
	push(toInsert) {
		toInsert = toInsert instanceof lNode ? toInsert : new lNode(toInsert);
		if (!this.tail) {
			this.head = this.tail = toInsert;
		} else {
			this.tail.next = toInsert;
			toInsert.next = null;
			toInsert.prev = this.tail;
			this.tail = toInsert;
		}
		this.length ++;
	}
	insert(toInsert, node) {
		toInsert = toInsert instanceof lNode ? toInsert : new lNode(toInsert);
		node.prev.next = toInsert;
		toInsert.next = node;
		toInsert.prev = node.prev;
		node.prev = toInsert;
		this.length ++;
	}
	forEach(cb) {
		let iter = this.head;
		while(iter) {
			cb.call(this, iter.value, iter);
			iter = iter.next;
		}
	}
	map(cb) {
		let iter = this.head;
		let ret = new List();
		while(iter) {
			ret.push(cb.call(this, iter.value, iter));
			iter = iter.next;
		}
		return ret;
	}
}

class lNode {
	constructor(value) {
		this.value = value;
		this.next = null;
		this.prev = null;
	}
}

export default List;