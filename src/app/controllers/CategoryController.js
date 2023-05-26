const CategoriesRepository = require('../repositories/CategoriesRepository')

class CategoryController {
	async index(request, response) {
		const categories = await CategoriesRepository.findAll()
		response.status(200).json(categories)
	}

	async store(request, response) {
		const { name } = request.body

		if (!name) {
			return response.status(400).json({
				error: 'Please provider a name for category.',
			})
		}

		const category = await CategoriesRepository.create({ name })
		response.status(201).json(category)
	}

	async show(request, response) {
		const { id } = request.params
		const category = await CategoriesRepository.findById(id)

		if (!category) {
			return response.status(404).json({ error: 'Category not found' })
		}

		response.status(200).json(category)
	}

	async update(request, response) {
		const { id } = request.params
		const { name } = request.body

		const categoryExists = await CategoriesRepository.findById(id)

		if (!categoryExists) {
			return response.status(400).json({ error: 'Category not found' })
		}

		if (!name) {
			return response.status(400).json({
				error: 'Name is required',
			})
		}

		const categoryUpdated = await CategoriesRepository.update(id, {
			name,
		})

		response.status(200).json(categoryUpdated)
	}

	async delete(request, response) {
		const { id } = request.params
		await CategoriesRepository.delete(id)
		response.sendStatus(204)
	}
}

module.exports = new CategoryController()
