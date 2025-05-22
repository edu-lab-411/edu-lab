package com.wessacademy.server2.repository;

import com.wessacademy.server2.model.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    boolean existsByUserIdAndCourseId(int userId, int courseId);
    List<Favorite> getFavoritesByUserId(int userId);
}