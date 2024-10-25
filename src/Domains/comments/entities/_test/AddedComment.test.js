const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
        };

        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: {},
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addedComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'abc',
            owner: 'user-123',
        };

        // Action
        const { id, content, owner } = new AddedComment(payload);

        // Assert
        expect(id).toStrictEqual(payload.id);
        expect(content).toStrictEqual(payload.content);
        expect(owner).toStrictEqual(payload.owner);
    });
})