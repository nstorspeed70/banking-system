/**
 * Handler for ListEnterprisesQuery
 */
class ListEnterprisesQueryHandler {
    constructor(enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }

    /**
     * Handle the ListEnterprisesQuery
     * @param {ListEnterprisesQuery} query - The query object
     * @returns {Promise<Object>} Response with enterprises list
     */
    async handle(query) {
        try {
            console.log('Query Handler: Processing ListEnterprisesQuery');

            const enterprises = await this.enterpriseRepository.findAllActive();

            console.log('Query Handler: Successfully retrieved enterprises');

            return {
                statusCode: 200,
                body: JSON.stringify({
                    items: enterprises,
                    total: enterprises.length
                })
            };
        } catch (error) {
            console.error('Query Handler Error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: 'Error interno del servidor',
                    details: error.message
                })
            };
        }
    }
}

module.exports = ListEnterprisesQueryHandler;
