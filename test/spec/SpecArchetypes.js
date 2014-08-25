/**
 * 
 * Test Registration, Instantiation & Instance Validation of Archetypes
 * 
 * Note: Errors are also logged to console for inspection
 * 
 */

describe("Test Servant SDK Archetype Functions --- ", function() {

	servant = new Servant(0, 'access_token_JTNxPsCA7IvZdZrCkrDsc1krrRinpSIVQg3a6v8acOmQibApd160A1yD9bJ4A04NFqSUiNcrH0A06nqE3UoQH3JRVrPhCJHrIgXGkQJzxVaguSJke9er0mkQ9zaEixnNRqJXLwRXs2dHyAjr0RgQ7UWjIkE7zSxvpMpsvkR2iMaey7ErkMGmoKfBwdtfxpcTEa7h9vMh57MIBTSkHd3DwPhiCShYMCuONvWOQVIW8XrjYQMuibqNUrzZJaLhIyXE');

	it("Instantiate Servant SDK", function() {
		expect(typeof servant._token).not.toBe('undefined');
	});

	it("Add Schemas", function() {
		servant.addArchetype('product', productSchema);
		servant.addArchetype('task', taskSchema);
		expect(typeof servant._archetypes.product).not.toBe('undefined');
		expect(typeof servant._archetypes.task).not.toBe('undefined');
		console.log("Add Schemas: ", servant._archetypes);
	});

	it("Create New Product Instance", function() {
		var product1 = servant.new('product');
		expect(product1).not.toEqual(null);
	});

	it("Validate New Product Instance", function() {
		var product2 = servant.new('product');
		servant.validate('product', product2, function(errors, product2) {
			console.log("Validate New Product Instance:", errors);
			expect(product2).toEqual(null);
			expect(typeof errors.title).not.toBe('undefined');
			expect(typeof errors.seller).not.toBe('undefined');
		});
	});

	it("Validate Missing Requireds", function() {
		var product4 = {
			category: 'alksfjasfljasf'
		};

		servant.validate('product', product4, function(errors, product4) {
			console.log("Validate Missing Requireds:", errors);
			expect(product4).toEqual(null);
			expect(typeof errors.title).not.toBe('undefined');
			expect(typeof errors.price).not.toBe('undefined');
			expect(typeof errors.seller).not.toBe('undefined');
		});
	});

	it("Validate Invalid Types", function() {
		var product3 = {
			title: 90817234124,
			price: 'asflj',
			seller: ['Store1']
		};

		servant.validate('product', product3, function(errors, product3) {
			console.log("Validate Invalid Types:", errors);
			expect(product3).toEqual(null);
			expect(typeof errors.title).not.toBe('undefined');
			expect(typeof errors.price).not.toBe('undefined');
			expect(typeof errors.seller).not.toBe('undefined');
		});
	});

	it("Validate Missing Required, Exceeded Maximum, Exceeded MaxLength", function() {
		var product5 = {
			price: 98729412049899999999999999999,
			seller: 'aslk;fjls;afj;osajfsa kls ljsa;lf jsa;lfj ;lasjf ;lasjf ;lasf ;lahsf;l asl;f jsalf; jaslk; fjas;lf jsal;f jasfl ;jsaf lkasjf ;alsjlasfjasl;fjasl;fjas;foasiufas;lfjasl;fjkasl;fjas;flkajsf ;safu sajf;l ajsf;l jasfs'
		};

		servant.validate('product', product5, function(errors, product5) {
			console.log("Validate Missing Required, Exceeded Maximum, Exceeded MaxLength:", errors);
			expect(product5).toEqual(null);
			expect(typeof errors.title).not.toBe('undefined');
			expect(typeof errors.price).not.toBe('undefined');
			expect(typeof errors.seller).not.toBe('undefined');
		});
	});

	it("Validate Minimum", function() {
		var product6 = {
			title: 'Product1',
			price: -2,
			seller: 'Store1'
		};

		servant.validate('product', product6, function(errors, product6) {
			console.log("Validate Minimum:", errors);
			expect(product6).toEqual(null);
			expect(typeof errors.price).not.toBe('undefined');
		});
	});

	it("Validate ENUM", function() {
		var product7 = servant.new('product');
		product7.title = 'asfja;slf';
		product7.price = 1234;
		product7.seller = 'asflkjasf';
		product7.condition = 'really old';
		product7.currency = 'Pesos';
		product7.payment_interval = 'minute';

		servant.validate('product', product7, function(errors, product7) {
			console.log("Validate ENUM:", errors);
			expect(product7).toEqual(null);
			expect(typeof errors.condition).not.toBe('undefined');
			expect(typeof errors.currency).not.toBe('undefined');
			expect(typeof errors.payment_interval).not.toBe('undefined');
		});
	});

	it("Validate Arrays Of Non-Unique Strings & Non-Unique Objects", function() {
		var product8 = servant.new('product');
		product8.title = 'Product1';
		product8.price = 1099;
		product8.seller = 'Store1';
		product8.tags = ['one', 'two', 'one', 'two', 'two', 'one'];
		product8.audience = ['one', 'one', 'two', 'two'];
		product8.shipping_prices = [{
			shipping_price: 1099,
			shipping_place: 'canada'
		}, {
			shipping_price: 1099,
			shipping_place: 'canada'
		}];
		product8.variations = [{
			variation_title: 'variation1',
			variation_in_stock: true
		}, {
			variation_title: 'variation1',
			variation_in_stock: true
		}]

		servant.validate('product', product8, function(errors, product8) {
			console.log("Validate Arrays Of Non-Unique Strings & Non-Unique Objects:", errors);
			expect(product8).toEqual(null);
			expect(typeof errors.variations).not.toBe('undefined');
			expect(typeof errors.shipping_prices).not.toBe('undefined');
			expect(typeof errors.tags).not.toBe('undefined');
		});
	});

	it("Validate Arrays With Exceeded MaxItems", function() {
		var product9 = servant.new('product');
		product9.title = 'Product1';
		product9.price = 1099;
		product9.seller = 'Store1';
		product9.tags = ['one', 'two', 'one', 'two', 'two', 'one', 'one', 'two', 'two', 'one'];
		product9.audience = ['one', 'one', 'two', 'two', 'one', 'two', 'one', 'two', 'two', 'one', 'one', 'two', 'two', 'one'];

		// Add 100 objects to arrays
		var i = 100;
		while (i--) {
			product9.variations.push({
				variation_title: 'variation' + i,
				variation_in_stock: true
			});
			product9.shipping_prices.push({
				shipping_price: 10 + i,
				shipping_place: 'canada'
			});
		};

		servant.validate('product', product9, function(errors, product9) {
			console.log("Validate Arrays With Exceeded MaxItems:", errors);
			expect(product9).toEqual(null);
			expect(typeof errors.variations).not.toBe('undefined');
			expect(typeof errors.shipping_prices).not.toBe('undefined');
			expect(typeof errors.tags).not.toBe('undefined');
			expect(typeof errors.audience).not.toBe('undefined');
		});
	});

	it("Validate Array Of Strings With Exceeded MaxLengths", function() {
		var product10 = servant.new('product');
		product10.title = 'Product1';
		product10.price = 1099;
		product10.seller = 'Store1';
		product10.tags = ['one', 'two', 'one', 'twasfsaljf lsajf l;sjf;l jsaf;lajsf; ljasf ;lasjf aslf; kjasf o'];

		servant.validate('product', product10, function(errors, product10) {
			console.log("Validate Array Of Strings With Exceeded MaxLengths:", errors);
			expect(product10).toEqual(null);
			expect(typeof errors.tags).not.toBe('undefined');
		});
	});

	it("Validate Array Of Strings With Invalid Types", function() {
		var product11 = servant.new('product');
		product11.title = 'Product1';
		product11.price = 1099;
		product11.seller = 'Store1';
		product11.tags = ['one', 'two', 8079087];
		product11.audience = ['one', 'two', 8079087];

		servant.validate('product', product11, function(errors, product11) {
			console.log("Validate Array Of Strings With Invalid Types:", errors);
			expect(product11).toEqual(null);
			expect(typeof errors.audience_array).not.toBe('undefined');
			expect(typeof errors.tags_array).not.toBe('undefined');
		});
	});

	it("Validate Array Of Objects With Not Allowed Properties", function() {
		var product12 = servant.new('product');
		product12.title = 'Product1';
		product12.price = 1099;
		product12.seller = 'Store1';
		product12.shipping_prices = [{
			shipping_price: 2000,
			shipping_place: 'canada',
			yada: 'yada'
		}]
		product12.variations = [{
			variation_title: ';alkjf ;lasf j',
			variation_in_stock: true,
			yada: ' yada'
		}]

		servant.validate('product', product12, function(errors, product12) {
			console.log("Validate Array Of Objects With Not Allowed Properties:", errors);
			expect(product12).toEqual(null);
			expect(typeof errors.shipping_prices_array['0'].yada).not.toBe('undefined');
			expect(typeof errors.variations_array['0'].yada).not.toBe('undefined');
		});
	});

	it("Validate Array Of Objects With Invalid Types", function() {
		var product13 = servant.new('product');
		product13.title = 'Product1';
		product13.price = 1099;
		product13.seller = 'Store1';
		product13.shipping_prices = ['asfasf']
		product13.variations = [08234098]

		servant.validate('product', product13, function(errors, product13) {
			console.log("Validate Array Of Objects With Invalid Types:", errors);
			expect(product13).toEqual(null);
			expect(typeof errors.shipping_prices_array['0']).not.toBe('undefined');
			expect(typeof errors.variations_array['0']).not.toBe('undefined');
		});
	});

	it("Validate Array Of Objects With Missing Properties", function() {
		var product14 = servant.new('product');
		product14.title = 'Product1';
		product14.price = 1099;
		product14.seller = 'Store1';
		product14.shipping_prices = [{
			shipping_price: 2000,
			shipping_place: 'canada'
		}, {
			shipping_price: 2000
		}]
		product14.variations = [{
			variation_title: ';alkjf ;lasf j'
		}]

		servant.validate('product', product14, function(errors, product14) {
			console.log("Validate Array Of Objects With Missing Properties:", errors);
			expect(product14).toEqual(null);
			expect(typeof errors.shipping_prices_array['1'].shipping_place).not.toBe('undefined');
			expect(typeof errors.variations_array['0'].variation_in_stock).not.toBe('undefined');
		});
	});

	it("Validate Array Of Objects With MaxLength Exceeded", function() {
		var product16 = servant.new('product');
		product16.title = 'Product1';
		product16.price = 1099;
		product16.seller = 'Store1';
		product16.variations = [{
			variation_title: ';alkjf ;;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j',
			variation_in_stock: true
		}]
		product16.shipping_prices = [{
			shipping_price: 2000,
			shipping_place: 'cda'
		}, {
			shipping_price: 2000
		}]

		servant.validate('product', product16, function(errors, product16) {
			console.log("Validate Array Of Objects With MaxLength Exceeded:", errors);
			expect(product16).toEqual(null);	
			expect(typeof errors.shipping_prices_array['0'].shipping_place).not.toBe('undefined');		
			expect(typeof errors.shipping_prices_array['1'].shipping_place).not.toBe('undefined');
			expect(typeof errors.variations_array['0'].variation_title).not.toBe('undefined');
		});
	});

	it("Validate Array Of Objects With Invalid Types For Properties", function() {
		var product17 = servant.new('product');
		product17.title = 'Product1';
		product17.price = 1099;
		product17.seller = 'Store1';
		product17.variations = [{
			variation_title: 2345,
			variation_in_stock: 23498
		}]
		product17.shipping_prices = [{
			shipping_price: '2000',
			shipping_place: 'canada'
		}]

		servant.validate('product', product17, function(errors, product17) {
			console.log("Validate Array Of Objects With Invalid Types For Properties:", errors);
			expect(product17).toEqual(null);	
			expect(typeof errors.shipping_prices_array['0'].shipping_price).not.toBe('undefined');
			expect(typeof errors.variations_array['0'].variation_in_stock).not.toBe('undefined');
			expect(typeof errors.variations_array['0'].variation_title).not.toBe('undefined');
		});
	});

	it("Instantiate Task", function() {
		var task = servant.new('task');
		console.log("Instantiate Task: ", task);
		expect(typeof task.task).not.toBe('undefined');
	});

	it("Validate Format", function() {
		var task2 = servant.new('task');
		task2.task = 'Clean Office';
		task2.due_date = '12-12-2012 11:01';

		servant.validate('task', task2, function(errors, task2) {
			console.log("Validate Format:", errors);
			expect(task2).toEqual(null);	
		});
	});

	it("Validate Correct Date-Time Format", function() {
		var task3 = servant.new('task');
		task3.task = 'Clean Office';
		task3.due_date = '1997-07-16T19:20:30+01:00';

		servant.validate('task', task3, function(errors, task3) {
			console.log("Validate Correct Date-Time Format:", task3);
			expect(errors).toEqual(null);
		});
	});


}); // describe