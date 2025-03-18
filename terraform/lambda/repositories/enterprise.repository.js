/**
 * Repository for Enterprise aggregate
 */
class EnterpriseRepository {
    constructor(pool) {
        this.pool = pool;
    }

    /**
     * Find all active enterprises
     * @returns {Promise<Array>} List of enterprises
     */
    async findAllActive() {
        try {
            console.log('Repository: Finding all active enterprises');
            
            const result = await this.pool.query(
                'SELECT * FROM enterprises WHERE is_active = true ORDER BY created_at DESC'
            );

            console.log(`Repository: Found ${result.rows.length} active enterprises`);
            
            return result.rows;
        } catch (error) {
            console.error('Repository Error: Failed to find active enterprises:', error);
            throw new Error('Failed to retrieve enterprises from database');
        }
    }
}

module.exports = EnterpriseRepository;
