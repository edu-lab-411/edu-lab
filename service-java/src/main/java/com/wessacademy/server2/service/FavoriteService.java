package com.wessacademy.server2.service;

import com.wessacademy.server2.model.Favorite;
import com.wessacademy.server2.repository.FavoriteRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class FavoriteService {
    public final FavoriteRepository favoriteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    @Cacheable("favorites")
    public List<Favorite> getFavorites() {
        return favoriteRepository.findAll();
    }

    @CacheEvict(value = "favorites", allEntries = true)
    public Favorite addFavorite(Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    @CacheEvict(value = "favorites", allEntries = true)
    public void deleteFavoriteById(String id) {
        favoriteRepository.deleteById(id);
    }

    @Cacheable(value = "favorites", key = "#userId+'-'+#courseId")
    public boolean existsByUserIdAndCourseId(int userId, int courseId) {
        return favoriteRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    @Cacheable(value = "favorites", key = "#userId")
    public List<Favorite> getFavoritesByUserId(int userId) {
        return favoriteRepository.getFavoritesByUserId(userId);
    }
}
