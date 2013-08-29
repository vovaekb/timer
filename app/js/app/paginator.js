angular.module("timer.paginator", ["timer.util"])
.factory("Paginator", function (Util) {
	var Service = {};
	return angular.extend(Service, {
		generatePages: function (length, limit) {
			return Util
			.range(Math.ceil(length / limit))
			.map(Util.sum.bind(null, 1));
		},
		calcPage: function (limit, offset) {
			return Math.ceil(offset / limit) + 1;
		},
		calcOffset: function (page, limit) {
			return (page - 1) * limit;
		},
		generatePagination: (function (pages, page) {
			var caret = this.caret,
				side = ~~ (caret / 2);

			return pages
			.map(function (value, index, array) {
				var isAlwaysVisible = value === 1 || value === array.length,
					caretCollides =	
						(value <= caret && page <= caret - side) ||
						(index + caret >= array.length && page + side >= array.length),
					isInCaret = page - side <= value && value <= page + side;

				if (isAlwaysVisible || caretCollides || isInCaret) {
					return value;
				}
			})
			.reduce(function (out, value, index) {
				var isUnique = out.indexOf(value) < 0,
					isNotPrevious = !isUnique && Util.last(out) !== value;

				if (isUnique || isNotPrevious) out.push(value);
				return out;
			}, [])
			.map(function (value, index) {
				return value ? value : -index;
			});
		}).bind(Service),
		paginate: (function (length, limit, offset) {
			var pages = this.generatePages(length, limit),
				page = this.calcPage(limit, offset);

			return this.generatePagination(pages, page);
		}).bind(Service),
		caret: 5,
		limitDefault: 25,
		limits: [25, 50, 100]
	});
})
.filter("page", function () {
	return function (data, limit, offset) {
		return data.slice(offset, ~~offset + ~~limit);
	};
})
.filter("pages", function (Util) {
	return function (array, limit, offset) {
		return Util
		.range(Math.ceil(array.length / limit))
		.map(Util.sum.bind(this, 1));
	};
})
.filter("offset", function (Paginator) {
	return Paginator.calcOffset;
})
.filter("isCurrentPage", function (Paginator) {
	return function (page, limit, offset) {
		return offset == Paginator.calcOffset(page, limit);
	};
})
.filter("pagination", function (Paginator) {
	return function (data, limit, offset) {
		return Paginator.paginate(data.length, limit, offset);
	};
});